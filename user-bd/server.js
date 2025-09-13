console.log("🚀 Running server.js from:", __filename);


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer'); // used for checking MulterError in global handler
const connectDB = require('./config/Db');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const profileRoutes = require('./routes/profileRoutes');
const materialRoutes = require('./routes/materialRoutes');
const payStackRoutes = require('./routes/payStackRoute');
const payStackWebHookRoutes = require('./routes/payStackWebHook');

const app = express();

if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is missing in .env');
    process.exit(1);
} else {
    console.log('✅ JWT_SECRET loaded');
}

connectDB();

const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:5500'];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// serve uploaded files (so disk files are reachable during dev/testing)
app.use('/secure_uploads', express.static(path.join(__dirname, 'secure_uploads')));

// keep your existing uploads static route if you rely on it (unchanged)
app.use('/uploads', express.static('uploads'));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
// recommended: mount profile at its own base path instead of re-using /api/auth
app.use('/api/auth', profileRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/paystack', payStackRoutes);
app.use('/api/paystack', payStackWebHookRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Multer-aware error handler + global fallback
app.use((err, req, res, next) => {
    // Multer errors
    if (err instanceof multer.MulterError) {
        console.error('🔥 Multer error:', err);
        return res.status(400).json({ message: 'File upload error', error: err.message });
    }

    // Commonly thrown errors from fileFilter (if still thrown)
    if (err && typeof err.message === 'string' && err.message.includes('Only PDF and MP4')) {
        console.error('🔥 File validation error:', err.message);
        return res.status(400).json({ message: err.message });
    }

    console.error('🔥 Global Error:', err && (err.stack || err));
    res.status(500).json({ message: 'Server Error', error: err && err.message });
});

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});



















// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const connectDB = require('./config/Db');

// const authRoutes = require('./routes/authRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const profileRoutes = require('./routes/profileRoutes');
// const materialRoutes = require('./routes/materialRoutes');
// const payStackRoutes = require('./routes/payStackRoute');
// const payStackWebHookRoutes = require('./routes/payStackWebHook');

// const app = express();

// // ✅ Log environment check
// if (!process.env.JWT_SECRET) {
//     console.error('❌ JWT_SECRET is missing in .env');
//     process.exit(1);
// } else {
//     console.log('✅ JWT_SECRET loaded');
// }

// // ✅ Connect to DB
// connectDB();

// // ✅ CORS setup
// const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:5500'];
// const corsOptions = {
//     origin: (origin, callback) => {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// };

// app.use(cors(corsOptions));
// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/uploads', express.static('uploads'));

// // ✅ Mount routes
// app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/auth', profileRoutes);
// app.use('/api/materials', materialRoutes);
// app.use('/api/paystack', payStackRoutes);
// app.use('/api/paystack', payStackWebHookRoutes);

// // ✅ Default route
// app.get('/', (req, res) => {
//     res.send('API is running...');
// });

// // ✅ Global error handler (strategic error logging)
// app.use((err, req, res, next) => {
//     console.error('🔥 Global Error:', err.stack || err);
//     res.status(500).json({ message: 'Server Error', error: err.message });
// });

// // ✅ Start server
// const PORT = process.env.SERVER_PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
// })


// ✅ Load environment variables first
// require('dotenv').config();

// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const connectDB = require('./config/Db');

// const authRoutes = require('./routes/authRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const profileRoutes = require('./routes/profileRoutes');
// const materialRoutes = require('./routes/materialRoutes');
// const payStackRoutes = require('./routes/payStackRoute');
// const payStackWebHookRoutes = require('./routes/payStackWebHook');

// const app = express();

// // ===== Insert directly after `const app = express();` =====
// app.use((req, res, next) => {
//   console.log(`➡️ Incoming ${req.method} ${req.originalUrl} — Authorization?=${!!req.headers.authorization} Content-Type=${req.headers['content-type']}`);
//   if (req.headers['content-length']) console.log('   content-length:', req.headers['content-length']);
//   next();
// });

// // ✅ Environment check
// if (!process.env.JWT_SECRET) {
//     console.error('❌ JWT_SECRET is missing in .env');
//     process.exit(1);
// } else {
//     console.log('✅ JWT_SECRET loaded');
// }

// // ✅ Connect to DB
// connectDB();

// // ✅ CORS setup
// const allowedOrigins = [
//   'http://localhost:3000',
//   'http://127.0.0.1:5500',
//   'http://localhost:5500'
// ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       console.error(`❌ CORS blocked request from: ${origin}`);
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // include OPTIONS
//   allowedHeaders: ['Content-Type', 'Authorization'],     // ✅ moved here
//   credentials: true
// };

// // Apply CORS middleware (including preflight)
// app.options('*', cors(corsOptions));
// app.use(cors(corsOptions));

// // ✅ Mount webhook BEFORE JSON middleware
// app.use('/api/paystack', payStackWebHookRoutes);

// // ✅ JSON & static middleware
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/uploads', express.static('uploads'));
// app.use(express.json());

// // ✅ Mount other routes
// app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/auth', profileRoutes);
// app.use('/api/materials', materialRoutes);
// app.use('/api/paystack', payStackRoutes);

// // ✅ Default route
// app.get('/', (req, res) => {
//   res.send('API is running...');
// });

// // ✅ Global error handler
// app.use((err, req, res, next) => {
//   console.error('🔥 Global Error:', err && err.stack ? err.stack : err);
//   console.error('   request:', req.method, req.originalUrl);
//   console.error('   headers.Authorization?', !!req.headers.authorization);
//   try {
//     console.error('   body keys:', req.body && Object.keys(req.body));
//   } catch (e) {
//     console.error('   body: (could not read body)');
//   }
//   if (err && err.code && err.code.startsWith('LIMIT_')) {
//     return res.status(400).json({ message: 'Upload limit: ' + err.message });
//   }
//   if (err && err.message && /Multer/i.test(err.name || '')) {
//     return res.status(400).json({ message: 'Upload error: ' + err.message });
//   }
//   res.status(500).json({ message: err && err.message ? err.message : 'Server Error' });
// });

// // ✅ Start server
// const PORT = process.env.SERVER_PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });





































