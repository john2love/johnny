require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();

// --- NEW: store secret in a variable and ensure it's present (non-invasive)
const secret = process.env.JWT_SECRET;
if (!secret) {
  console.error('❌ JWT_SECRET is missing. Set it in your .env file.');
  // Note: not exiting so server can still run in some dev flows; but you can change this behavior if desired
}

// Admin Register
router.post('/register', async (req, res) => {
  console.log('📥 /register hit:', req.body);

  const { username, password } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({ username, passwordHash, loginCode: code });

    console.log('✅ Admin created:', newAdmin.username);
    res.status(201).json({ message: 'Registered', code });
  } catch (err) {
    console.error('❌ Registration error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  const { username, password, code } = req.body;
  console.log('🔐 Login attempt:', username);

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      console.warn('❌ No such admin');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    const isCodeValid = admin.loginCode === code;

    if (isPasswordValid && isCodeValid) {
      // ✅ Use the secret variable (unchanged behavior if process.env.JWT_SECRET was used)
      const token = jwt.sign(
        { adminId: admin._id, role: 'admin' },
        secret,
        { expiresIn: '1h' }
      );

      // --- NEW: helpful debug log showing token creation (non-invasive)
      console.log('🔑 Token created for adminId=', admin._id.toString(), 'expiresIn=1h');

      console.log('✅ Login successful:', username);
      res.json({ message: 'Logged in', token });
    } else {
      console.warn('❌ Login failed: Wrong credentials');
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('🚨 Login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;




















// require('dotenv').config();

// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const Admin = require('../models/Admin');

// const router = express.Router();

// // Admin Register
// router.post('/register', async (req, res) => {
//   console.log('📥 /register hit:', req.body);

//   const { username, password } = req.body;
//   const code = Math.floor(100000 + Math.random() * 900000).toString();

//   try {
//     const passwordHash = await bcrypt.hash(password, 10);
//     const newAdmin = await Admin.create({ username, passwordHash, loginCode: code });

//     console.log('✅ Admin created:', newAdmin.username);
//     res.status(201).json({ message: 'Registered', code });
//   } catch (err) {
//     console.error('❌ Registration error:', err.message);
//     res.status(400).json({ error: err.message });
//   }
// });

// // Admin Login
// router.post('/login', async (req, res) => {
//   const { username, password, code } = req.body;
//   console.log('🔐 Login attempt:', username);

//   try {
//     const admin = await Admin.findOne({ username });

//     if (!admin) {
//       console.warn('❌ No such admin');
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
//     const isCodeValid = admin.loginCode === code;

//     if (isPasswordValid && isCodeValid) {
//       const token = jwt.sign(
//         { adminId: admin._id, role: 'admin' },
//         process.env.JWT_SECRET,
//         { expiresIn: '1h' }
//       );
//       console.log('✅ Login successful:', username);
//       res.json({ message: 'Logged in', token });
//     } else {
//       console.warn('❌ Login failed: Wrong credentials');
//       res.status(401).json({ error: 'Invalid credentials' });
//     }
//   } catch (err) {
//     console.error('🚨 Login error:', err.message);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;












