const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Material = require('../models/Material');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const convertToHLS = require('../utils/createHLS');
const { authenticateToken, verifyAdmin } = require('../middleware/authMiddleware');

/* ----------------------------------
   Helpers
---------------------------------- */
const toRelativePath = (p) => {
  if (!p) return '';
  const rel = path.isAbsolute(p) ? path.relative(process.cwd(), p) : p;
  return rel.replace(/\\/g, '/');
};

/* ==================================
   1️⃣ UPLOAD MATERIAL (ADMIN)
================================== */
router.post(
  '/upload',
  authenticateToken,
  verifyAdmin,
  upload.single('file'),

  // Multer error handler
  (err, req, res, next) => {
    if (err) {
      console.error('[UPLOAD] Multer error:', err.message || err);
      return res.status(400).json({
        message: req.fileValidationError || 'File upload failed',
        error: err.message || String(err),
      });
    }
    next();
  },

  asyncHandler(async (req, res) => {
    const file = req.file;
    const title = (req.body?.title || '').trim();
    const price = Number(req.body?.price);

    if (!file) return res.status(400).json({ message: 'No file uploaded.' });
    if (!title) return res.status(400).json({ message: 'Title is required.' });
    if (Number.isNaN(price)) {
      return res.status(400).json({ message: 'Valid price is required.' });
    }

    const isPDF = /pdf/i.test(file.mimetype);
    let finalPath = toRelativePath(file.path);
    let hlsFolder = null;

    if (!isPDF) {
      hlsFolder = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const hlsDir = path.join(process.cwd(), 'uploads', 'hls', hlsFolder);
      fs.mkdirSync(hlsDir, { recursive: true });

      try {
        const playlistPath = await convertToHLS(file.path, hlsDir);
        finalPath = toRelativePath(playlistPath);
      } catch (err) {
        console.error('[UPLOAD] HLS conversion failed:', err);
        return res.status(500).json({ message: 'Video conversion failed' });
      }
    }

    const material = await Material.create({
      title,
      type: isPDF ? 'pdf' : 'video',
      price,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      path: finalPath,
      hlsFolder,
      isActive: true,
    });

    res.status(201).json({
      message: 'Material uploaded successfully',
      material,
    });
  })
);

/* ==================================
   2️⃣ ADMIN MATERIALS TABLE
================================== */
router.get(
  '/admin',
  authenticateToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const materials = await Material.find({})
      .sort({ createdAt: -1 })
      .select('title type price isActive createdAt')
      .lean();

    res.json({ materials });
  })
);

/* ==================================
   3️⃣ EDIT MATERIAL (ADMIN)
================================== */
router.put(
  '/:id',
  authenticateToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const { title, price, isActive } = req.body;

    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    if (typeof title === 'string' && title.trim()) {
      material.title = title.trim();
    }

    if (price !== undefined) {
      const p = Number(price);
      if (Number.isNaN(p) || p < 0) {
        return res.status(400).json({ message: 'Invalid price' });
      }
      material.price = p;
    }

    if (typeof isActive === 'boolean') {
      material.isActive = isActive;
    }

    await material.save();

    res.json({ message: 'Material updated', material });
  })
);

/* ==================================
   4️⃣ SOFT DELETE / RESTORE
================================== */
router.patch(
  '/:id/deactivate',
  authenticateToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });

    material.isActive = false;
    await material.save();

    res.json({ message: 'Material deactivated', material });
  })
);

router.patch(
  '/:id/activate',
  authenticateToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });

    material.isActive = true;
    await material.save();

    res.json({ message: 'Material activated', material });
  })
);

/* ==================================
   5️⃣ USER MATERIAL LIST
================================== */
router.get(
  '/',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const userId = req.user.userId || req.user.id;

    const user = await User.findById(userId)
      .select('purchasedMaterials')
      .lean();

    const materials = await Material.find({ isActive: true })
      .select('title type price')
      .lean();

    const ownedSet = new Set(
      (user?.purchasedMaterials || []).map((id) => id.toString())
    );

    const response = materials.map((m) => ({
      _id: m._id,
      title: m.title,
      type: m.type,
      price: m.price,
      owned: ownedSet.has(m._id.toString()),
    }));

    res.json({ materials: response });
  })
);

/* ==================================
   6️⃣ HLS STREAM (PURCHASE-PROTECTED)
================================== */
router.get(
  '/stream/:id/:file',
  asyncHandler(async (req, res) => {
    const { id, file } = req.params;
    const token = req.query.token;

    if (!token) return res.sendStatus(401);

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.sendStatus(401);
    }

    const material = await Material.findById(id).lean();
    if (!material || !material.hlsFolder) return res.sendStatus(404);

    const user = await User.findById(decoded.userId)
      .select('purchasedMaterials')
      .lean();

    const hasAccess =
      material.price === 0 ||
      user?.purchasedMaterials?.some(
        (mId) => mId.toString() === material._id.toString()
      );

    if (!hasAccess) return res.sendStatus(403);

    const safeFile = path.basename(file);
    const ext = path.extname(safeFile);
    if (!['.m3u8', '.ts'].includes(ext)) return res.sendStatus(400);

    const baseDir = path.resolve(process.cwd(), 'uploads', 'hls', material.hlsFolder);
    const filePath = path.join(baseDir, safeFile);
    await fs.promises.access(filePath, fs.constants.R_OK);

    res.setHeader(
      'Content-Type',
      ext === '.m3u8'
        ? 'application/vnd.apple.mpegurl'
        : 'video/mp2t'
    );

    fs.createReadStream(filePath).pipe(res);
  })
);

module.exports = router;











/*const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Material = require('../models/Material');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const convertToHLS = require('../utils/createHLS');
const { authenticateToken, verifyAdmin } = require('../middleware/authMiddleware');

/* ----------------------------------
   Helpers
---------------------------------- *

const toRelativePath = (p) => {
  if (!p) return '';
  const rel = path.isAbsolute(p) ? path.relative(process.cwd(), p) : p;
  return rel.replace(/\\/g, '/');
};

/* ----------------------------------
   1️⃣ UPLOAD MATERIAL (ADMIN)
---------------------------------- *

router.post(
  '/upload',
  authenticateToken,
  verifyAdmin,
  upload.single('file'),

  // Multer error handler
  (err, req, res, next) => {
    if (err) {
      console.error('[UPLOAD] Multer error:', err.message || err);
      return res.status(400).json({
        message: req.fileValidationError || 'File upload failed',
        error: err.message || String(err),
      });
    }
    next();
  },

  asyncHandler(async (req, res) => {
    const file = req.file;
    const title = (req.body?.title || '').trim();
    const price = Number(req.body?.price);

    if (!file) return res.status(400).json({ message: 'No file uploaded.' });
    if (!title) return res.status(400).json({ message: 'Title is required.' });
    if (Number.isNaN(price)) {
      return res.status(400).json({ message: 'Valid price is required.' });
    }

    const isPDF = /pdf/i.test(file.mimetype);
    let finalPath = toRelativePath(file.path);
    let hlsFolder = null;

    if (!isPDF) {
      hlsFolder = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const hlsDir = path.join(process.cwd(), 'uploads', 'hls', hlsFolder);

      fs.mkdirSync(hlsDir, { recursive: true });

      try {
        const playlistPath = await convertToHLS(file.path, hlsDir);
        finalPath = toRelativePath(playlistPath);
      } catch (err) {
        console.error('[UPLOAD] HLS conversion failed:', err);
        return res.status(500).json({ message: 'Video conversion failed' });
      }
    }

    const material = await Material.create({
      title,
      type: isPDF ? 'pdf' : 'video',
      price,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      path: finalPath,
      hlsFolder,
    });

    res.status(201).json({
      message: 'Material uploaded successfully',
      material,
    });
  })
);

/* ----------------------------------
   2️⃣ LIST MATERIALS (USER)
   🔑 FRONTEND CONTRACT
---------------------------------- *

router.get(
  '/',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
      .select('purchasedMaterials')
      .lean();

    const materials = await Material.find({ isActive: true })
      .select('title type price')
      .lean();

    const ownedSet = new Set(
      (user?.purchasedMaterials || []).map(id => id.toString())
    );

    const response = materials.map(m => ({
      _id: m._id,
      title: m.title,
      type: m.type,
      price: m.price,
      owned: ownedSet.has(m._id.toString()),
    }));

    res.json({ materials: response });
  })
);

/* ----------------------------------
   3️⃣ STREAM VIDEO (TOKEN-PROTECTED)
---------------------------------- *

router.get(
  '/stream/:id/:file',
  asyncHandler(async (req, res) => {
    const { id, file } = req.params;
    const token = req.query.token;

    if (!token) return res.sendStatus(401);

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.sendStatus(401);
    }

    const material = await Material.findById(id).lean();
    if (!material || !material.hlsFolder) return res.sendStatus(404);

    const user = await User.findById(decoded.userId)
      .select('purchasedMaterials')
      .lean();

    const hasAccess =
      material.price === 0 ||
      user?.purchasedMaterials?.some(
        mId => mId.toString() === material._id.toString()
      );

    if (!hasAccess) return res.sendStatus(403);

    const safeFile = path.basename(file);
    const ext = path.extname(safeFile);
    if (!['.m3u8', '.ts'].includes(ext)) return res.sendStatus(400);

    const baseDir = path.resolve(
      process.cwd(),
      'uploads',
      'hls',
      material.hlsFolder
    );

    const filePath = path.join(baseDir, safeFile);
    await fs.promises.access(filePath, fs.constants.R_OK);

    res.setHeader(
      'Content-Type',
      ext === '.m3u8'
        ? 'application/vnd.apple.mpegurl'
        : 'video/mp2t'
    );

    fs.createReadStream(filePath).pipe(res);
  })
);

module.exports = router;

*/







