// routes/payStackWebHook.js
const express = require('express');
const crypto = require('crypto');
const https = require('https');
const User = require('../models/User');
const Material = require('../models/Material');
require('dotenv').config();

const router = express.Router();

/**
 * Helper: Verify a transaction with Paystack
 */
function verifyWithPaystack(reference, secret) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${secret}` }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(body || '{}'));
        } catch (e) {
          reject(new Error(`Failed to parse Paystack response: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * POST /api/paystack/webhook
 * Handles Paystack webhook callbacks
 * Uses raw body so signature verification works
 */
router.post('/webhook', express.raw({ type: '*/*' }), async (req, res) => {

  console.log('📩 Incoming Paystack Webhook Headers:', req.headers);
  console.log('📩 Incoming Paystack Webhook Raw Body:', req.body.toString('utf8'));
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(500).send('Missing PAYSTACK_SECRET_KEY');

  try {
    // Verify signature
    const hash = crypto
      .createHmac('sha512', secret)
      .update(req.body)
      .digest('hex');
    const signature = req.headers['x-paystack-signature'];

    if (!signature || signature !== hash) {
      return res.status(401).send('Invalid signature');
    }

    // Parse event
    const event = JSON.parse(req.body.toString('utf8'));
    if (event.event !== 'charge.success') return res.sendStatus(200);

    const reference = event?.data?.reference;
    const { username, materialId } = event?.data?.metadata || {};

    if (!reference || !username || !materialId) {
      return res.status(400).send('Missing reference/metadata');
    }

    // Verify with Paystack
    const verify = await verifyWithPaystack(reference, secret);
    if (!verify?.status || verify?.data?.status !== 'success') {
      return res.status(400).send('Verification failed');
    }

    // Update DB
    const user = await User.findOne({ username });
    const material = await Material.findById(materialId);

    if (!user || !material) {
    console.error(`❌ Webhook error: User=${username || "N/A"} or Material=${materialId || "N/A"} not found (Ref=${reference})`);
    return res.status(404).send('User or material not found');
    }

    if (!user.purchasedMaterials.includes(material._id)) {
    user.purchasedMaterials.push(material._id);
    await user.save();
    console.log(`✅ Payment verified & material linked: User=${user.username}, Material=${material.title || material._id}, Ref=${reference}`);
    } else {
    console.log(`ℹ️ Payment already recorded earlier: User=${user.username}, Material=${material.title || material._id}, Ref=${reference}`);
    }



    return res.sendStatus(200);
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(500).send('Webhook processing failed');
  }
});

/**
 * POST /api/paystack/verify
 * Used by frontend to confirm a payment after inline checkout
 */
router.post('/verify', express.json(), async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(500).json({ message: 'Missing PAYSTACK_SECRET_KEY' });

  const { reference, materialId } = req.body || {};
  if (!reference) {
    console.error("❌ No reference received in /verify:", req.body);
    return res.status(400).json({ error: "Reference is required" });
  }

  console.log("📩 /verify request body:", req.body);

  try {
    const verify = await verifyWithPaystack(reference, secret);
    if (!verify?.status || verify?.data?.status !== 'success') {
      return res.status(400).json({ message: 'Verification failed', details: verify });
    }

      // Update DB if metadata is included (fallback to body-sent materialId if missing)
      const { username, materialId: metaMaterialId } = verify?.data?.metadata || {};
      const finalMaterialId = metaMaterialId || materialId; // fallback if metadata missing

      if (username && finalMaterialId) {
        const user = await User.findOne({ username });
        const material = await Material.findById(finalMaterialId);

        if (!user || !material) {
          console.error(`❌ Verify error: User=${username || "N/A"} or Material=${finalMaterialId || "N/A"} not found (Ref=${reference})`);
        } else if (!user.purchasedMaterials.includes(material._id)) {
          user.purchasedMaterials.push(material._id);
          await user.save();
          console.log(`✅ Payment verified via /verify: User=${user.username}, Material=${material.title || material._id}, Ref=${reference}`);
        } else {
          console.log(`ℹ️ /verify: Payment already recorded earlier: User=${user.username}, Material=${material.title || material._id}, Ref=${reference}`);
        }
      } else {
        console.warn("ℹ️ /verify: Missing username or materialId in metadata/body — DB not updated.");
      }



    return res.json({
      success: true,
      message: 'Verification successful',
      reference,
      status: verify.data.status,
      amount: verify.data.amount,
      currency: verify.data.currency,
      customer: verify.data.customer?.email || null,
      metadata: verify.data.metadata || null
    });
  } catch (err) {
    console.error('Verify error:', err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
