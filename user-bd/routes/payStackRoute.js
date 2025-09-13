// routes/paystackRoute.js
const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Material = require('../models/Material');

require('dotenv').config();

const router = express.Router();
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Unified payment initiation handler
async function initiatePaymentHandler(req, res) {
  try {
    if (!PAYSTACK_SECRET_KEY) {
      console.error('[Payment Error] PAYSTACK_SECRET_KEY missing in environment.');
      return res.status(500).json({
        message: 'Server configuration error: payment provider not configured.',
        hint: 'Set PAYSTACK_SECRET_KEY in your .env and restart the server.'
      });
    }

    const { materialId } = req.body;
    if (!materialId) {
      console.error('[Payment Error] Missing materialId in request body.');
      return res.status(400).json({
        message: 'Material ID is required.',
        hint: 'Include materialId in POST body.'
      });
    }

    const material = await Material.findById(materialId);
    if (!material) {
      console.error(`[Payment Error] Material ID ${materialId} not found.`);
      return res.status(404).json({ message: 'Material not found.' });
    }

    const user = await User.findById(req.user.userId || req.user.id);
    if (!user) {
      console.error(`[Payment Error] User ID ${req.user.userId || req.user.id} not found.`);
      return res.status(404).json({ message: 'User not found.' });
    }

    const bodyData = {
      email: user.email,
      amount: material.price * 100,
      metadata: { materialId: material._id.toString(), username: user.username },
      callback_url: 'http://localhost:3000/profile.html?payment=success'
    };

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });

    const data = await response.json();

    if (!data || data.status !== true) {
      console.error('[Payment Error] Paystack initialization failed →', JSON.stringify(data, null, 2));
      return res.status(500).json({ message: 'Payment initialization failed.', error: data });
    }

    console.log(`✅ Payment initialized → User: ${user.username}, Material: ${material.title}`);
    return res.json({ authorization_url: data.data.authorization_url });

  } catch (err) {
    console.error('[Server Error] Payment initialization exception:', err.stack || err);
    return res.status(500).json({ message: 'Server error during payment initialization.', error: err.message });
  }
}

// Routes
router.post('/initiate', authenticateToken, initiatePaymentHandler);
router.post('/initiate-payment', authenticateToken, initiatePaymentHandler);

module.exports = router;
