// middlewares/authMiddleware.js

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

/* ===============================
   AUTHENTICATE TOKEN
=============================== */
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded; // { id, role, ... }
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

/* ===============================
   VERIFY ADMIN ROLE
=============================== */
const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }

  req.admin = req.user;
  next();
};

module.exports = {
  authenticateToken,
  verifyAdmin,
};



/*
require('dotenv').config();

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

if (!secret) {
  console.error('❌ JWT_SECRET is missing in .env');
  process.exit(1);
}

/**
 * Authenticate any logged-in user (admin or normal user)
 * Attaches decoded token payload to req.user
 *
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // { userId | adminId, role, exp }
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Verify admin role
 * Must be used AFTER authenticateToken
 *
const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    console.warn('⚠️ Admin access denied');
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  // Normalize admin reference
  req.admin = req.user;
  next();
};

module.exports = {
  authenticateToken,
  verifyAdmin,
};
*/