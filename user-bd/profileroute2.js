const express = require('express');
const User = require('../models/User');
const Material = require('../models/Material'); // ✅ new line

const { authenticateToken } = require('../middleware/authMiddleware'); 
const router = express.Router();

// ===== Profile Route =====
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    console.log(`📩 Profile route accessed by user ID: ${req.user.userId || req.user.id}`);

    const user = await User.findById(req.user.userId || req.user.id)
      .select('-password')
      .populate('purchasedMaterials', 'title type filename path'); 
      // ✅ only fields that exist in Material schema

    if (!user) {
      console.error(`❌ Profile fetch error: User not found for ID ${req.user.userId || req.user.id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`✅ Profile fetched successfully for username: ${user.username}`);

    res.json({
      user: {
        username: user.username,
        email: user.email,
        purchasedMaterials: user.purchasedMaterials || []
      }
    });

  } catch (error) {
    console.error('❌ Profile fetch server error:', error.message);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// ===== Purchased Materials Route =====
router.get('/materials', authenticateToken, async (req, res) => {
  try {
    console.log(`📩 Purchased materials route hit by user ID: ${req.user.userId || req.user.id}`);

    const user = await User.findById(req.user.userId || req.user.id)
      .populate('purchasedMaterials', 'title type filename path'); 
      // ✅ fields exist in Material schema

    if (!user) {
      console.error(`❌ Purchased materials fetch error: User not found for ID ${req.user.userId || req.user.id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Build proper file URLs dynamically
    const materials = user.purchasedMaterials.map(mat => ({
      _id: mat._id,
      title: mat.title,
      type: mat.type,
      filename: mat.filename,                // ✅ added
      path: mat.path,                        // ✅ added
      url: `/${mat.path}/${mat.filename}`,    // ✅ still present for compatibility
      streamUrl: `/api/materials/stream/${mat._id}`


    }));

    console.log(`✅ Purchased materials fetched: ${materials.length} items`);
    res.json(materials);

  } catch (error) {
    console.error('❌ Purchased materials fetch server error:', error.message);
    res.status(500).json({ message: 'Server error fetching purchased materials' });
  }
});

module.exports = router;