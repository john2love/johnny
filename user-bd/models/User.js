const mongoose = require('mongoose');

// Define the structure (schema) of a user
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Role-based access control
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    // Purchased / unlocked materials
    // Source of truth for access checks
    purchasedMaterials: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Material',
        },
      ],
      default: [],
      index: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.User || mongoose.model('User', UserSchema);





/*const mongoose = require('mongoose');

// Define the structure (schema) of a user
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  // ✅ ROLE (REQUIRED FOR ROLE-BASED ACCESS)
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  // Purchased materials
  purchasedMaterials: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material'
  }]

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
*/



