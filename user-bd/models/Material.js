const mongoose = require('mongoose');
const path = require('path');

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
  path: {
    type: String,
    default: 'secure_uploads/materials',
    set: function (value) {
      // ✅ Always store relative path only
      if (!value) return value;
      // if absolute path given (C:\... or /...),
      // keep only the relative part from secure_uploads onwards
      const idx = value.indexOf('secure_uploads');
      return idx !== -1 ? value.substring(idx) : value;
    }
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.models.Material || mongoose.model('Material', materialSchema);
