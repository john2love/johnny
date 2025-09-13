const mongoose = require('mongoose');

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
    // New field to store purchased materials by ID
    purchasedMaterials: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material'
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
