const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error(error);

    // ✅ Catch duplicate key error (e.g. email)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



















































// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const Admin = require('../models/Admin');
// const AdminUser = require('../models/AdminUser');
// const router = express.Router();
// const authenticateToken = require('../middleware/authMiddleware');
// // Register Route
// router.post('/register', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: 'User already exists' });

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new User({ username, email, password: hashedPassword });
//     await newUser.save();

//     res.status(201).json({ message: 'User registered successfully' });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Login Route

//   router.post('/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     console.log('Incoming login:', username, password);

//     if (!username || !password) {
//       return res.status(400).json({ message: 'Username and password are required.' });
//     }

//     // ✅ Find user by username
//     const user = await User.findOne({ username });
//     console.log('Found user:', user);

//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//     // ✅ Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//     // ✅ Generate JWT
//     const token = jwt.sign(
//       { userId: user._id, username: user.username },
//       process.env.JWT_SECRET,
//       { expiresIn: '2h' }
//     );

//     // ✅ Send token and user data (omit password)
//     res.status(200).json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email
//       }
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


// // Protected profile route
// router.get('/profile', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select('-password');
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     res.json({ user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


// // ✅ Profile route
// router.get('/profile', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     res.json({
//       user: {
//         username: user.username,
//         email: user.email,
//       }
//     });
//   } catch (error) {
//     console.error('Profile fetch error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // routes/adminReg.js

// router.post('/register', async (req, res) => {
//   const { username, password } = req.body;
//  const code = Math.floor(100000 + Math.random() * 900000).toString();

//   const passwordHash = await bcrypt.hash(password, 10);
//   try {
//     await Admin.create({ username, passwordHash, loginCode: code });
//     res.status(201).json({ message: 'Registered', code });
//   } catch(err) {
//     res.status(400).json({ error: err.message });
//   }
// });
// // admin login
// router.post('/login', async (req, res) => {
//   const { username, code } = req.body;
//   const admin = await Admin.findOne({ username });
//   if (admin && admin.loginCode === code) {
//     // optionally issue a session or JWT
//     res.json({ message: 'Logged in' });
//   } else {
//     res.status(401).json({ error: 'Invalid credentials' });
//   }
// });

// module.exports = router;










// const express = require('express');
// const bcrypt = require('bcrypt');
// const User = require('../models/User');
// const router = express.Router();
// //register route
// router.post('/register', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     // Check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create and save user
//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword
//     });

//     await newUser.save();
//     res.status(201).json({ message: 'User registered successfully' });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // login route


// module.exports = router;
