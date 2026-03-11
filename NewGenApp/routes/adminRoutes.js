// routes/adminRoutes.js
require('dotenv').config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const adminController = require("../controllers/admin.controller");

const {
  authenticateToken,
  verifyAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

/* =====================================================
   REGISTER ADMIN
   POST /api/admin/register
===================================================== */
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const existing = await Admin.findOne({ username }).lean();
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await Admin.create({
      username,
      passwordHash,
    });

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        username: admin.username,
      },
    });
  } catch (err) {
    console.error("Admin register error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =====================================================
   LOGIN ADMIN
   POST /api/admin/login
===================================================== */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: "admin",
      },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =====================================================
   PROTECTED ADMIN ROUTES
===================================================== */
router.use(authenticateToken, verifyAdmin);

/* =====================================================
   ADMIN PROFILE
   GET /api/admin/profile
===================================================== */
router.get("/profile", async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id)
      .select("-passwordHash")
      .lean();

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      admin,
    });
  } catch (err) {
    console.error("Admin profile error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =====================================================
   ADMIN DASHBOARD
   GET /api/admin/dashboard
===================================================== */
router.get("/dashboard", adminController.getDashboard);

module.exports = router;







/*
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Admin = require('../models/Admin');
const { authenticateToken, verifyAdmin } = require('../middleware/authMiddleware');

// ==========================
// 🔐 Admin registration
// POST /api/admin/register
// ==========================
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });

    const existing = await Admin.findOne({ username });
    if (existing) return res.status(409).json({ error: 'Username already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ username, passwordHash });

    // Example code returned to frontend (for demo)
    const code = Math.floor(100000 + Math.random() * 900000);
    res.status(201).json({ success: true, code, admin: { id: admin._id, username: admin.username } });
  } catch (err) {
    console.error('❌ Admin register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================
// 🔐 Admin login
// POST /api/admin/login
// ==========================
router.post('/login', async (req, res) => {
  try {
    const { username, password, code } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ error: 'Admin not found' });

    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid password' });

    // Optional: validate code if implemented (for now skip)
    // const validCode = await verifyCode(admin._id, code);

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin._id, role: 'admin' },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '2h' }
    );

    res.json({ success: true, token, admin: { id: admin._id, username: admin.username } });
  } catch (err) {
    console.error('❌ Admin login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================
// 🔐 Admin profile
// GET /api/admin/profile
// ==========================
router.get('/profile', authenticateToken, verifyAdmin, async (req, res) => {
  try {
    const adminId = req.admin.adminId || req.admin.id;
    const admin = await Admin.findById(adminId).select('-passwordHash');
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json({ admin });
  } catch (err) {
    console.error('❌ Admin profile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================
// 🔐 Admin dashboard
// GET /api/admin/dashboard
// ==========================
router.get('/dashboard', authenticateToken, verifyAdmin, async (req, res) => {
  try {
    res.json({ message: 'Admin dashboard access granted', admin: req.admin });
  } catch (err) {
    console.error('❌ Dashboard error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
*/



