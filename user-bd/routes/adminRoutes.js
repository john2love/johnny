require('dotenv').config();

const express = require('express');
const router = express.Router();

const Admin = require('../models/Admin');
const { authenticateToken, verifyAdmin } = require('../middleware/authMiddleware');

/**
 * 🔐 Admin profile
 * GET /api/admin/profile
 */
router.get(
  '/profile',
  authenticateToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const adminId = req.admin.adminId || req.admin.id;

      const admin = await Admin.findById(adminId).select('-passwordHash');
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      res.json(admin);
    } catch (err) {
      console.error('❌ Admin profile error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * 🔐 Admin dashboard stats (example)
 * GET /api/admin/dashboard
 */
router.get(
  '/dashboard',
  authenticateToken,
  verifyAdmin,
  async (req, res) => {
    try {
      res.json({
        message: 'Admin dashboard access granted',
        admin: req.admin,
      });
    } catch (err) {
      console.error('❌ Dashboard error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = {
  router,
};




// require('dotenv').config();

// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const Admin = require('../models/Admin');

// const router = express.Router();

// const secret = process.env.JWT_SECRET;
// if (!secret) {
//   console.error('❌ JWT_SECRET is missing.');
// }

// /* =========================
//    Admin Auth Middleware
// ========================= *
// function adminAuth(req, res, next) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader?.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'No token provided' });
//   }

//   try {
//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, secret);

//     if (decoded.role !== 'admin') {
//       return res.status(403).json({ error: 'Admin only' });
//     }

//     req.admin = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: 'Invalid or expired token' });
//   }
// }

// /* =========================
//    Admin Register
// ========================= *
// router.post('/register', async (req, res) => {
//   const { username, password } = req.body;
//   const code = Math.floor(100000 + Math.random() * 900000).toString();

//   try {
//     const passwordHash = await bcrypt.hash(password, 10);
//     await Admin.create({ username, passwordHash, loginCode: code });

//     res.status(201).json({ message: 'Registered', code });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// /* =========================
//    Admin Login
// ========================= *
// router.post('/login', async (req, res) => {
//   const { username, password, code } = req.body;

//   try {
//     const admin = await Admin.findOne({ username });
//     if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

//     const ok =
//       (await bcrypt.compare(password, admin.passwordHash)) &&
//       admin.loginCode === code;

//     if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

//     const token = jwt.sign(
//       { adminId: admin._id, role: 'admin' },
//       secret,
//       { expiresIn: '1h' }
//     );

//     res.json({ message: 'Logged in', token });
//   } catch {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// /* =========================
//    Admin Profile
// ========================= *
// router.get('/profile', adminAuth, async (req, res) => {
//   const admin = await Admin.findById(req.admin.adminId).select('-passwordHash');
//   if (!admin) return res.status(404).json({ error: 'Admin not found' });

//   res.json({ id: admin._id, username: admin.username, role: 'admin' });
// });

// module.exports = {
//   router,
//   adminAuth,
// };








