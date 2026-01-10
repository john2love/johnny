const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Material',
      required: true,
      index: true,
    },

    // Amount paid in smallest currency unit (kobo)
    amountPaid: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: 'NGN',
    },

    paymentProvider: {
      type: String,
      default: 'paystack',
    },

    // Paystack transaction reference
    paymentRef: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    status: {
      type: String,
      enum: ['success', 'failed', 'pending'],
      default: 'success',
    },

    purchasedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate purchases per user/material at DB level
purchaseSchema.index({ userId: 1, materialId: 1 });

module.exports =
  mongoose.models.Purchase ||
  mongoose.model('Purchase', purchaseSchema);






/*const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },

  materialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: true,
    index: true,
  },

  amountPaid: {
    type: Number, // store in kobo
    required: true,
  },

  currency: {
    type: String,
    default: 'NGN',
  },

  paymentProvider: {
    type: String,
    default: 'paystack',
  },

  paymentRef: {
    type: String,
    required: true,
    unique: true,
  },

  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'success',
  },

  purchasedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports =
  mongoose.models.Purchase || mongoose.model('Purchase', purchaseSchema);
*/