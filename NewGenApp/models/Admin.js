const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // never return by default
    },

    loginCode: {
      type: String,
      select: false,
    },

    loginCodeExpires: {
      type: Date,
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

module.exports = mongoose.model("Admin", adminSchema);