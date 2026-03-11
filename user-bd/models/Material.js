const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 3,
      maxlength: 200,
    },

    type: {
      type: String,
      enum: ["pdf", "video"],
      required: true,
    },

    price: {
      type: Number, // stored in kobo
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "NGN",
      uppercase: true,
    },

    filename: {
      type: String,
      required: true,
    },

    originalName: {
      type: String,
    },

    size: {
      type: Number,
      min: 0,
    },

    path: {
      type: String,
      required: true,
      set(value) {
        if (!value) return value;
        const idx = value.indexOf("secure_uploads");
        return idx !== -1 ? value.substring(idx) : value;
      },
    },

    hlsFolder: {
      type: String,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

materialSchema.index({ title: "text" });

module.exports = mongoose.model("Material", materialSchema);




/*
const mongoose = require('mongoose')
const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },

  type: {
    type: String,
    enum: ['pdf', 'video'],
    required: true,
  },

  price: {
    type: Number, // kobo
    required: true,
  },

  currency: {
    type: String,
    default: 'NGN',
  },

  filename: { type: String, required: true },
  originalName: String,
  size: Number,

  path: {
    type: String,
    default: 'secure_uploads/materials',
    set(value) {
      if (!value) return value;
      const idx = value.indexOf('secure_uploads');
      return idx !== -1 ? value.substring(idx) : value;
    },
  },

  hlsFolder: {
    type: String,
    index: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports =
  mongoose.models.Material || mongoose.model('Material', materialSchema);

*/