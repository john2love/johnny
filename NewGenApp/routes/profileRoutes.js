const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId)
      .select('-password')
      .populate('purchasedMaterials', 'title type filename path');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        purchasedMaterials: user.purchasedMaterials || []
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/materials', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('purchasedMaterials', 'title type filename path');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.purchasedMaterials.map(mat => ({
      _id: mat._id,
      title: mat.title,
      type: mat.type,
      filename: mat.filename,
      path: mat.path,
      url: `/${mat.path}/${mat.filename}`
    })));

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;










/*const express = require('express');
const User = require('../models/User');
const Material = require('../models/Material');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// ===== Profile Route =====
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    console.log(`📩 Profile route accessed by user ID: ${userId}`);

    const user = await User.findById(userId)
      .select('-password')
      .populate('purchasedMaterials', 'title type filename path');

    if (!user) {
      console.error(`❌ User not found: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`✅ Profile fetched successfully for username: ${user.username}`);

    // ✅ ROLE INCLUDED (CRITICAL FIX)
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        purchasedMaterials: user.purchasedMaterials || []
      }
    });

  } catch (error) {
    console.error('❌ Profile fetch error:', error.message);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// ===== Purchased Materials Route =====
router.get('/materials', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    console.log(`📩 Purchased materials route hit by user ID: ${userId}`);

    const user = await User.findById(userId)
      .populate('purchasedMaterials', 'title type filename path');

    if (!user) {
      console.error(`❌ User not found: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    const materials = user.purchasedMaterials.map(mat => ({
      _id: mat._id,
      title: mat.title,
      type: mat.type,
      filename: mat.filename,
      path: mat.path,
      url: `/${mat.path}/${mat.filename}`
    }));

    console.log(`✅ Purchased materials fetched: ${materials.length}`);
    res.json(materials);

  } catch (error) {
    console.error('❌ Purchased materials error:', error.message);
    res.status(500).json({ message: 'Server error fetching purchased materials' });
  }
});

module.exports = router;

*/










