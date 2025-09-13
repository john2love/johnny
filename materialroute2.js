const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Material = require('../models/Material');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { authenticateToken, verifyAdmin } = require('../middleware/authMiddleware');

// ---------- Helpers ----------
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error('❌ [Unhandled Route Error]', err);
    return res.status(500).json({
      message: 'Unexpected server error',
      error: err?.message,
      ...(process.env.NODE_ENV === 'development' && err?.stack
        ? { stack: err.stack }
        : {}),
    });
  });

const toRelativePath = (p) => {
  if (!p) return '';
  const rel = path.isAbsolute(p) ? path.relative(process.cwd(), p) : p;
  return rel.replace(/\\/g, '/');
};
// -----------------------------

// ✅ POST /api/materials/upload — Upload PDF/Video + Save to Mongo
router.post(
  '/upload',
  authenticateToken,
  verifyAdmin,
  upload.single('file'),
  (err, req, res, next) => {
    if (err) {
      console.error('❌ Multer error caught in middleware:', err && err.message ? err.message : err);
      if (req && req.fileValidationError) {
        return res.status(400).json({ message: req.fileValidationError });
      }
      return res.status(400).json({ message: 'File upload failed', error: err && err.message ? err.message : String(err) });
    }
    next();
  }, // field name must be "file"
  asyncHandler(async (req, res) => {
    console.log('➡️ [UPLOAD] hit', {
      url: req.originalUrl,
      method: req.method,
      at: new Date().toISOString(),
    });

    // DB state helps catch Atlas connection issues quickly
    console.log('🧭 Mongoose readyState:', mongoose.connection?.readyState);

    const file = req.file;
    const title = (req.body?.title || '').trim();

    console.log('📥 Parsed fields:', { title });
    console.log('📦 Parsed file:',
      file
        ? {
            originalname: file.originalname,
            filename: file.filename,
            mimetype: file.mimetype,
            path: file.path,
            size: file.size,
          }
        : null
    );

    if (!file) return res.status(400).json({ message: 'No file uploaded (field name must be "file").' });
    if (!title) return res.status(400).json({ message: 'Title is required.' });

    const relativePath = toRelativePath(file.path);
    console.log('🔗 Storing relative path:', relativePath);

    const doc = {
      title,
      type: /pdf/i.test(file.mimetype) ? 'pdf' : 'video',
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      path: relativePath,
      // Track uploader if available
      uploadedBy: req.user?.adminId || req.user?._id || undefined,
    };

    try {
      const saved = await Material.create(doc);
      console.log('✅ Saved to DB:', { id: saved._id.toString(), title: saved.title });
      return res.status(201).json({ message: '✅ Material uploaded successfully!', material: saved });
    } catch (err) {
      const validation = err?.errors
        ? Object.fromEntries(
            Object.entries(err.errors).map(([k, v]) => [k, v?.message])
          )
        : undefined;
      console.error('❌ DB Save Error:', {
        name: err?.name,
        code: err?.code,
        message: err?.message,
        validation,
      });
      return res.status(500).json({ message: 'DB save failed', error: err?.message, validation });
    }
  })
);

// ✅ GET /api/materials/stream/:id — Stream Video or PDF
router.get(
  '/stream/:id',
  authenticateToken,
  asyncHandler(async (req, res) => {

      if (!req.user) {
      console.warn('⚠️ Stream attempt without valid user in req.user');
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // find material
    const material = await Material.findById(req.params.id).lean();
    if (!material) return res.status(404).json({ message: 'Material not found' });

    // --- Purchase check: ensure requesting user bought this material
    const userId = req.user?.userId || req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId).select('purchasedMaterials').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const purchased = Array.isArray(user.purchasedMaterials) && user.purchasedMaterials.some(pid => pid.toString() === material._id.toString());
    if (!purchased) {
      console.warn(`⚠️ Unauthorized stream attempt by user ${userId} for material ${material._id}`);
      return res.status(403).json({ message: 'You have not purchased this material' });
    }

    // Resolve file path and stream (same as before)
    let filePath = material.path;
    if (!path.isAbsolute(filePath)) filePath = path.resolve(process.cwd(), filePath);
    console.log('📂 Streaming file resolved to:', filePath);

    const stat = await fs.promises.stat(filePath).catch(() => null);
    if (!stat) return res.status(404).json({ message: 'File missing on disk' });

    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : fileSize - 1;

      if (Number.isNaN(start) || Number.isNaN(end) || start > end) {
        return res.status(416).set('Content-Range', `bytes */${fileSize}`).end();
      }

      const chunkSize = end - start + 1;
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Disposition', 'inline; filename="' + (material.filename || 'file') + '"');

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': material.type === 'video' ? 'video/mp4' : 'application/pdf',
      });

      fs.createReadStream(filePath, { start, end }).pipe(res);
    } 
 else {
  // 🔒 Security headers
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Disposition', 'inline; filename="' + (material.filename || 'file') + '"');

      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': material.type === 'video' ? 'video/mp4' : 'application/pdf',
     });
      fs.createReadStream(filePath).pipe(res);
    }
  })
);

module.exports = router;