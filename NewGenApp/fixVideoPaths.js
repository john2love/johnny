// fixVideoPaths.js
require('dotenv').config(); // load .env first
const mongoose = require('mongoose');
const Material = require('./models/Material'); // adjust path if needed

async function fixVideoPaths() {
  try {
    // Modern Mongoose connection (no deprecated options)
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const videos = await Material.find({ type: 'video' });
    let updatedCount = 0;

    for (const video of videos) {
      if (!video.path || !video.path.startsWith('uploads/hls/')) {
        const oldPath = video.path;
        const filename = video.filename;
        const newPath = `uploads/hls/${filename}/index.m3u8`;

        video.path = newPath;
        await video.save();
        updatedCount++;
        console.log(`🔹 Updated video ${video._id}: "${oldPath}" → "${newPath}"`);
      }
    }

    if (updatedCount === 0) {
      console.log('✅ All video paths are already correct.');
    } else {
      console.log(`✅ Fixed ${updatedCount} video path(s).`);
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (err) {
    console.error('❌ Error fixing paths:', err);
    await mongoose.disconnect();
  }
}

fixVideoPaths();
