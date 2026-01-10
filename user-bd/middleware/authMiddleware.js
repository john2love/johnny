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
 */
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
 */
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





/*require('dotenv').config(); // ✅ Ensures .env is loaded

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  try {
    const decoded = jwt.decode(token);
    if (decoded) {
      // ✅ show adminId / role if present
      console.log(`🔐 Incoming token for user=${decoded.adminId || decoded.username || 'undefined'}, role=${decoded.role || 'unknown'}, exp=${new Date(decoded.exp * 1000).toISOString()}`);
    } else {
      console.log("⚠️ Incoming token could not be decoded");
    }
  } catch (err) {
    console.error("❌ Failed to decode token:", err.message);
  }

  if (!secret) {
    console.error('❌ JWT_SECRET is missing. Fix your .env file.');
    return res.status(500).json({ message: 'Server configuration error: missing JWT secret.' });
  }

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    // ✅ store the full payload for downstream middlewares/routes
    req.user = decoded;

    // 🔧 FIX B: Wrap next() for better debugging
    try {
      next();
    } catch (err) {
      console.error("❌ ERROR: next() in authenticateToken threw:", err);
      return res.status(500).json({ message: 'Internal error in middleware chain.' });
    }

  } catch (error) {
    console.error('❌ authenticateToken verify error:', error && error.message ? error.message : error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// ---------- FIXED verifyAdmin: rely on req.user when possible ----------
const verifyAdmin = (req, res, next) => {
  // Prefer using the decoded payload already attached by authenticateToken
  if (req.user) {
    if (req.user.role !== 'admin') {
      console.warn('⚠️ verifyAdmin failed: role is', req.user.role);
      return res.status(403).json({ message: 'Access denied. Not an admin.' });
    }
    req.admin = req.user; // attach the same payload for routes
    console.log('🔐 verifyAdmin passed via req.user:', { adminId: req.admin.adminId || req.admin.id, role: req.admin.role });

    // 🔧 FIX B: Wrap next() for better debugging
    try {
      return next();
    } catch (err) {
      console.error("❌ ERROR: next() in verifyAdmin threw:", err);
      return res.status(500).json({ message: 'Internal error in admin middleware.' });
    }
  }

  // Fallback: if req.user not present, verify token here (rare)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Not an admin.' });
    }
    req.admin = decoded;
    console.log('🔐 verifyAdmin passed via fallback verify:', { adminId: decoded.adminId || decoded.id, role: decoded.role });

    // 🔧 FIX B: Wrap next() for better debugging
    try {
      next();
    } catch (err) {
      console.error("❌ ERROR: next() in verifyAdmin fallback threw:", err);
      return res.status(500).json({ message: 'Internal error in admin fallback.' });
    }

  } catch (err) {
    console.error('❌ verifyAdmin token verify error:', err && err.message ? err.message : err);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = {
  authenticateToken,
  verifyAdmin
};

*/




