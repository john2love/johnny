// models/Admin.js
const mongoose = require('mongoose');
const AdminSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  passwordHash: String,
  loginCode: String,
});
module.exports = mongoose.model('Admin', AdminSchema);
