const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
      required: true,
    },

    amount: {
      type: Number, // smallest unit (kobo)
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "NGN",
      uppercase: true,
    },

    paymentProvider: {
      type: String,
      enum: ["paystack"],
      default: "paystack",
    },

    paymentRef: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Prevent duplicate successful purchases per user/material
purchaseSchema.index(
  { user: 1, material: 1 },
  { unique: true }
);

module.exports = mongoose.model("Purchase", purchaseSchema);





/*
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


*/