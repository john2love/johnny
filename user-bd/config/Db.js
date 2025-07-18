// /config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    const URI = process.env.MONGODB_URI;

    if (!URI) {
        console.error(" MONGODB_URI not found in .env file");
        process.exit(1);
    }

    try {
        await mongoose.connect(URI); // No options needed for modern versions
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error(' MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
