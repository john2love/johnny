const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // never return password by default
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Quick access cache (real ownership is verified via Purchase collection)
    purchasedMaterials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Clean JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);







/*
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

*/