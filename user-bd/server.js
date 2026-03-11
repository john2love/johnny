require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/Db");
const errorMiddleware = require("./middlewares/error.middleware");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const profileRoutes = require("./routes/profileRoutes");
const materialRoutes = require("./routes/materialRoutes");
const payStackRoutes = require("./routes/payStackRoute");
const payStackWebHookRoutes = require("./routes/payStackWebHook");

const app = express();

/* ===============================
   ENV VALIDATION
=============================== */
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variables");
}

/* ===============================
   DATABASE CONNECTION
=============================== */
connectDB();

/* ===============================
   CORS CONFIGURATION
=============================== */
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:5500",
  "http://localhost:5500",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));

/* ===============================
   CORE MIDDLEWARES
=============================== */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ===============================
   ROUTES
=============================== */
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/paystack", payStackRoutes);
app.use("/api/paystack", payStackWebHookRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

/* ===============================
   404 HANDLER
=============================== */
app.use((req, res, next) => {
  const err = new Error("Route not found");
  err.status = 404;
  next(err);
});

/* ===============================
   GLOBAL ERROR HANDLER
=============================== */
app.use(errorMiddleware);

/* ===============================
   SERVER START
=============================== */
const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});








/*
console.log("🚀 Running server.js from:", __filename);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const connectDB = require('./config/Db');

const authRoutes = require('./routes/authRoutes');
// server.js
const adminRoutes = require('./routes/adminRoutes'); // ✅ now it's a router directly

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

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'http://localhost:5500'
];

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

// Static access (dev/testing only)
app.use('/secure_uploads', express.static(path.join(__dirname, 'secure_uploads')));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/paystack', payStackRoutes);
app.use('/api/paystack', payStackWebHookRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Global error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('🔥 Multer error:', err);
    return res.status(400).json({ message: 'File upload error', error: err.message });
  }

  console.error('🔥 Global Error:', err && (err.stack || err));
  res.status(500).json({ message: 'Server Error', error: err && err.message });
});

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

*/