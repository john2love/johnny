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



/*const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  type: {
    type: String, // "pdf" or "video"
    required: true,
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
  },

  // Used for PDFs and legacy fallback
  path: {
    type: String,
    default: 'secure_uploads/materials',
    set(value) {
      if (!value) return value;
      const idx = value.indexOf('secure_uploads');
      return idx !== -1 ? value.substring(idx) : value;
    },
  },

  // ✅ NEW — authoritative HLS directory
  hlsFolder: {
    type: String,
    index: true,
  },

  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports =
  mongoose.models.Material || mongoose.model('Material', materialSchema);
  */
