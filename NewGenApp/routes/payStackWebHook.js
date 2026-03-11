const express = require('express');
const crypto = require('crypto');
const https = require('https');

const User = require('../models/User');
const Material = require('../models/Material');
const Purchase = require('../models/Purchase');

require('dotenv').config();

const router = express.Router();

/* ----------------------------------
   Helper: Verify with Paystack
---------------------------------- */
function verifyWithPaystack(reference, secret) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.paystack.co',
        path: `/transaction/verify/${reference}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${secret}`,
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch {
            reject(new Error('Invalid Paystack response'));
          }
        });
      }
    );

    req.on('error', reject);
    req.end();
  });
}

/* ----------------------------------
   WEBHOOK — AUTHORITATIVE
---------------------------------- */
router.post('/webhook', express.raw({ type: '*/*' }), async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.sendStatus(500);

  try {
    const signature = req.headers['x-paystack-signature'];
    const hash = crypto
      .createHmac('sha512', secret)
      .update(req.body)
      .digest('hex');

    if (signature !== hash) {
      console.warn('⚠️ Invalid Paystack signature');
      return res.sendStatus(401);
    }

    const event = JSON.parse(req.body.toString());
    if (event.event !== 'charge.success') {
      return res.sendStatus(200);
    }

    const { reference, amount, currency, metadata } = event.data;
    const { username, materialId } = metadata || {};

    if (!reference || !username || !materialId) {
      console.warn('⚠️ Missing webhook metadata');
      return res.sendStatus(400);
    }

    const verify = await verifyWithPaystack(reference, secret);
    if (verify?.data?.status !== 'success') {
      console.warn(`⚠️ Paystack verification failed: ${reference}`);
      return res.sendStatus(400);
    }

    const user = await User.findOne({ username });
    const material = await Material.findById(materialId);

    if (!user || !material) {
      console.error('❌ Invalid user or material', { username, materialId });
      return res.sendStatus(404);
    }

    const expectedAmount = material.price * 100;
    if (!material.isFree && amount !== expectedAmount) {
      console.error('❌ Amount mismatch', { reference, amount, expectedAmount });
      return res.sendStatus(400);
    }

    /* -------- Idempotent Purchase -------- */
    let purchase = await Purchase.findOne({ paymentRef: reference });

    if (!purchase) {
      purchase = await Purchase.create({
        userId: user._id,
        materialId: material._id,
        amountPaid: amount,
        currency: currency || 'NGN',
        paymentRef: reference,
        status: 'success',
      });

      console.log(`🧾 Purchase recorded → ${reference}`);
    }

    /* -------- Grant Access -------- */
    if (!user.purchasedMaterials.includes(material._id)) {
      user.purchasedMaterials.push(material._id);
      await user.save();
      console.log(`✅ Access granted → ${user.username}`);
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error('🔥 Webhook error:', err);
    return res.sendStatus(500);
  }
});

/* ----------------------------------
   VERIFY — FRONTEND FALLBACK
---------------------------------- */
router.post('/verify', express.json(), async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return res.status(500).json({ message: 'Server misconfigured' });
  }

  const { reference } = req.body;
  if (!reference) {
    return res.status(400).json({ message: 'Reference required' });
  }

  try {
    const verify = await verifyWithPaystack(reference, secret);
    if (verify?.data?.status !== 'success') {
      return res.status(400).json({ message: 'Verification failed' });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('🔥 Verify error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;






/*const express = require('express');
const crypto = require('crypto');
const https = require('https');

const User = require('../models/User');
const Material = require('../models/Material');
const Purchase = require('../models/Purchase');

require('dotenv').config();

const router = express.Router();

/* ---------- Helper: Verify transaction ---------- 
function verifyWithPaystack(reference, secret) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.paystack.co',
        path: `/transaction/verify/${reference}`,
        method: 'GET',
        headers: { Authorization: `Bearer ${secret}` },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch {
            reject(new Error('Invalid Paystack response'));
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

/* ---------- WEBHOOK (AUTHORITATIVE) ---------- 
router.post('/webhook', express.raw({ type: '* (THERE IS A FOWARD SLASH)*' }), async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.sendStatus(500);

  try {
    const signature = req.headers['x-paystack-signature'];
    const hash = crypto
      .createHmac('sha512', secret)
      .update(req.body)
      .digest('hex');

    if (signature !== hash) {
      console.warn('⚠️ Invalid Paystack signature');
      return res.sendStatus(401);
    }

    const event = JSON.parse(req.body.toString());
    if (event.event !== 'charge.success') return res.sendStatus(200);

    const { reference, metadata, amount, currency } = event.data;
    const { username, materialId } = metadata || {};

    if (!reference || !username || !materialId) {
      console.warn('⚠️ Missing webhook metadata');
      return res.sendStatus(400);
    }

    const verify = await verifyWithPaystack(reference, secret);
    if (verify?.data?.status !== 'success') {
      console.warn(`⚠️ Verification failed: ${reference}`);
      return res.sendStatus(400);
    }

    const user = await User.findOne({ username });
    const material = await Material.findById(materialId);

    if (!user || !material || typeof material.price !== 'number') {
      console.error('❌ Invalid user/material/price', { username, materialId });
      return res.sendStatus(404);
    }

    /* ---- Idempotent purchase creation ---- 
    let purchase = await Purchase.findOne({ paymentRef: reference });

    if (!purchase) {
      purchase = await Purchase.create({
        userId: user._id,
        materialId: material._id,
        amountPaid: material.price * 100, // price snapshot (kobo)
        currency: currency || 'NGN',
        paymentRef: reference,
        status: 'success',
      });
      console.log(`🧾 Purchase created → ${reference}`);
    }

    /* ---- Entitlement cache ---- *
    if (!user.purchasedMaterials.includes(material._id)) {
      user.purchasedMaterials.push(material._id);
      await user.save();
      console.log(`✅ Material granted → ${user.username}`);
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error('🔥 Webhook error:', err.message);
    return res.sendStatus(500);
  }
});

/* ---------- VERIFY (FRONTEND FALLBACK) ---------- 
router.post('/verify', express.json(), async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(500).json({ message: 'Server misconfigured' });

  const { reference, materialId } = req.body;
  if (!reference) return res.status(400).json({ message: 'Reference required' });

  try {
    const verify = await verifyWithPaystack(reference, secret);
    if (verify?.data?.status !== 'success') {
      return res.status(400).json({ message: 'Verification failed' });
    }

    const { username, materialId: metaId } = verify.data.metadata || {};
    const finalMaterialId = metaId || materialId;

    if (!username || !finalMaterialId) {
      return res.json({ success: true });
    }

    const user = await User.findOne({ username });
    const material = await Material.findById(finalMaterialId);
    if (!user || !material || typeof material.price !== 'number') {
      return res.json({ success: true });
    }

    let purchase = await Purchase.findOne({ paymentRef: reference });
    if (!purchase) {
      await Purchase.create({
        userId: user._id,
        materialId: material._id,
        amountPaid: material.price * 100,
        currency: verify.data.currency || 'NGN',
        paymentRef: reference,
        status: 'success',
      });
    }

    if (!user.purchasedMaterials.includes(material._id)) {
      user.purchasedMaterials.push(material._id);
      await user.save();
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('🔥 Verify error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
*/






