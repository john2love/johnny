const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Material = require('../models/Material');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const convertToHLS = require('../utils/createHLS');
const asyncHandler = require('express-async-handler');


const { authenticateToken, verifyAdmin } = require('../middleware/authMiddleware');


const toRelativePath = (p) => {
  if (!p) return '';
  const rel = path.isAbsolute(p) ? path.relative(process.cwd(), p) : p;
  return rel.replace(/\\/g, '/');
};
// -----------------------------

// 1️⃣ UPLOAD ROUTE
router.post(
  '/upload',
  authenticateToken,
  verifyAdmin,
  upload.single('file'),

  // Multer error handler
  (err, req, res, next) => {
    if (err) {
      console.error('[UPLOAD] Multer error:', err.message || err);
      if (req.fileValidationError) {
        return res.status(400).json({ message: req.fileValidationError });
      }
      return res.status(400).json({ message: 'File upload failed', error: err.message || String(err) });
    }
    next();
  },

  asyncHandler(async (req, res) => {
    const file = req.file;
    const title = (req.body?.title || '').trim();

    if (!file) return res.status(400).json({ message: 'No file uploaded (field name must be "file").' });
    if (!title) return res.status(400).json({ message: 'Title is required.' });

    console.log('[UPLOAD] Parsed file:', {
      originalname: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      path: file.path,
      size: file.size,
    });

    const isPDF = /pdf/i.test(file.mimetype);
    let finalPath = toRelativePath(file.path);
    let hlsFolder = null;

    if (!isPDF) {
      console.log('[UPLOAD] Video detected — starting HLS conversion...');

      // ✅ Generate stable HLS folder (no .mp4)
      hlsFolder = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const hlsOutputDir = path.join(process.cwd(), 'uploads', 'hls', hlsFolder);

      try {
        fs.mkdirSync(hlsOutputDir, { recursive: true });
        const playlistPath = await convertToHLS(file.path, hlsOutputDir);
        finalPath = toRelativePath(playlistPath);
        console.log('[UPLOAD] HLS conversion complete:', finalPath);
      } catch (err) {
        console.error('[UPLOAD] HLS conversion failed:', err?.message || err);
        return res.status(500).json({ message: 'Video conversion failed', error: err?.message || String(err) });
      }
    }

    const doc = {
      title,
      type: isPDF ? 'pdf' : 'video',
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      path: finalPath,
      hlsFolder, // ✅ persist HLS folder for streaming
      uploadedBy: req.user?.adminId || req.user?._id,
    };

    try {
      const saved = await Material.create(doc);
      console.log('[UPLOAD] Saved to DB:', { id: saved._id.toString(), title: saved.title });
      return res.status(201).json({ message: 'Material uploaded successfully!', material: saved });
    } catch (err) {
      const validation = err?.errors
        ? Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v?.message]))
        : undefined;
      console.error('[UPLOAD] DB save error:', { name: err?.name, code: err?.code, message: err?.message, validation });
      return res.status(500).json({ message: 'DB save failed', error: err?.message, validation });
    }
  })
);


// 2️⃣ STREAMING ROUTE

router.get('/stream/:id/:file', asyncHandler(async (req, res) => {
  const { id, file } = req.params;
  const token = req.query.token;

  if (!token) {
    console.error('[STREAM] Missing token', { materialId: id });
    return res.sendStatus(401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error('[STREAM] Invalid token', { materialId: id });
    return res.sendStatus(401);
  }

  const material = await Material.findById(id).lean();
  if (!material) {
    console.error('[STREAM] Material not found', { materialId: id });
    return res.sendStatus(404);
  }

  // ✅ FIX: authoritative source for video streaming
  if (!material.hlsFolder) {
    console.error('[STREAM] HLS folder missing', {
      materialId: id,
      materialTitle: material.title,
    });
    return res.sendStatus(500);
  }

  const user = await User.findById(decoded.userId)
    .select('purchasedMaterials')
    .lean();

  if (!user) {
    console.error('[STREAM] User not found', {
      userId: decoded.userId,
      materialId: id,
    });
    return res.sendStatus(401);
  }

  const hasAccess = user.purchasedMaterials?.some(
    mId => mId.toString() === material._id.toString()
  );

  if (!hasAccess) {
    console.error('[STREAM] Access denied', {
      userId: decoded.userId,
      materialId: id,
    });
    return res.sendStatus(403);
  }

  const safeFile = path.basename(file);
  const ext = path.extname(safeFile);

  if (!['.m3u8', '.ts'].includes(ext)) {
    console.error('[STREAM] Invalid file type', {
      materialId: id,
      file: safeFile,
    });
    return res.sendStatus(400);
  }

  // ✅ FIX: deterministic HLS path
  const baseDir = path.resolve(
    process.cwd(),
    'uploads',
    'hls',
    material.hlsFolder
  );

  const filePath = path.join(baseDir, safeFile);

  try {
    await fs.promises.access(filePath, fs.constants.R_OK);
  } catch (err) {
    console.error('[STREAM] File not found or unreadable', {
      materialId: id,
      file: safeFile,
      filePath,
      error: err?.message,
    });
    return res.sendStatus(404);
  }

  res.setHeader(
    'Content-Type',
    ext === '.m3u8'
      ? 'application/vnd.apple.mpegurl'
      : 'video/mp2t'
  );

  console.log('[STREAM] Streaming file', {
    userId: decoded.userId,
    materialId: id,
    file: safeFile,
  });

  fs.createReadStream(filePath).pipe(res);
}));

module.exports = router;










/*
router.get('/stream/:id/:file', asyncHandler(async (req, res) => {
  const { id, file } = req.params;
  const token = req.query.token;

  if (!token) {
    console.error('[STREAM] Missing token', { materialId: id });
    return res.sendStatus(401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error('[STREAM] Invalid token', { materialId: id });
    return res.sendStatus(401);
  }

  const material = await Material.findById(id).lean();
  if (!material) {
    console.error('[STREAM] Material not found', { materialId: id });
    return res.sendStatus(404);
  }

  if (!material.path) {
    console.error('[STREAM] Material path missing', {
      materialId: id,
      materialTitle: material.title,
    });
    return res.sendStatus(500);
  }

  const user = await User.findById(decoded.userId)
    .select('purchasedMaterials')
    .lean();

  if (!user) {
    console.error('[STREAM] User not found', {
      userId: decoded.userId,
      materialId: id,
    });
    return res.sendStatus(401);
  }

  const hasAccess = user.purchasedMaterials?.some(
    mId => mId.toString() === material._id.toString()
  );

  if (!hasAccess) {
    console.error('[STREAM] Access denied', {
      userId: decoded.userId,
      materialId: id,
    });
    return res.sendStatus(403);
  }

  const safeFile = path.basename(file);
  const ext = path.extname(safeFile);

  if (!['.m3u8', '.ts'].includes(ext)) {
    console.error('[STREAM] Invalid file type', {
      materialId: id,
      file: safeFile,
    });
    return res.sendStatus(400);
  }

  let baseDir = path.resolve(process.cwd(), material.path);

// FIX: if path mistakenly points to index.m3u8, use its directory
if (baseDir.endsWith('.m3u8')) {
  baseDir = path.dirname(baseDir);
}
if (baseDir.endsWith('.mp4')) {
  baseDir = baseDir.replace(/\.mp4$/, '');
}
  const filePath = path.join(baseDir, safeFile);

  try {
    await fs.promises.access(filePath, fs.constants.R_OK);
  } catch {
    console.error('[STREAM] File not found or unreadable', {
      materialId: id,
      file: safeFile,
      filePath,
    });
    return res.sendStatus(404);
  }

  res.setHeader(
    'Content-Type',
    ext === '.m3u8'
      ? 'application/vnd.apple.mpegurl'
      : 'video/mp2t'
  );

  console.log('[STREAM] Streaming file', {
    userId: decoded.userId,
    materialId: id,
    file: safeFile,
  });

  fs.createReadStream(filePath).pipe(res);
}));
/*
THERE WAS A COMMENT CLOSING TAG AS PART OF THE CODE IN THE CODE, TO USE THIS FILE YOU HAVE TO PUT IT BACK, CHECK LINE BELOW THAT HAS ISNAN.
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Material = require('../models/Material');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // added for streaming token
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
  asyncHandler(async (req, res) => {

    // --- FIX: read token from query instead of header ---
    const token = req.query.token;
    if (!token) {
      return res.status(401).json({ message: 'Missing streaming token' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid streaming token' });
    }

    const userId = decoded.userId;

    // find material
    const material = await Material.findById(req.params.id).lean();
    if (!material) return res.status(404).json({ message: 'Material not found' });

    // --- Purchase check: ensure requesting user bought this material
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
    res.header("Accept-Ranges", "bytes");

    if (range) {
      const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : fileSize - 1;

      if (Number.isNaN(start) || Number.isNaN(end) || start > end) {
        return res.status(416).set('Content-Range', `bytes (ther was a comment closing tag here as part of the code)${fileSize}`).end();
      }

      const chunkSize = end - start + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': material.type === 'video' ? 'video/mp4' : 'application/pdf',
      });

      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': material.type === 'video' ? 'video/mp4' : 'application/pdf',
      });
      fs.createReadStream(filePath).pipe(res);
    }
  })
);

module.exports = router;

 */


/*
router.get('/stream/:id/:file', asyncHandler(async (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(401).json({ message: 'Missing token' });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const userId = decoded.userId;
  const material = await Material.findById(req.params.id).lean();
  if (!material) return res.status(404).json({ message: 'Material not found' });

  const user = await User.findById(userId).select('purchasedMaterials').lean();
  const purchased = user && user.purchasedMaterials.some(id => id.toString() === material._id.toString());
  if (!purchased) return res.status(403).json({ message: 'Not purchased' });

  // Safe file serving
  const folder = path.dirname(material.path);
  const safeFile = path.basename(req.params.file);
  const allowedExt = ['.m3u8', '.ts'];
  if (!allowedExt.includes(path.extname(safeFile))) {
    return res.status(400).json({ message: 'Invalid file request' });
  }

  const filePath = path.join(folder, safeFile);
  console.log(`📺 Streaming request by user ${userId} for file: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Segment not found' });
  }

  if (filePath.endsWith('.m3u8')) {
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
  } else if (filePath.endsWith('.ts')) {
    res.setHeader('Content-Type', 'video/mp2t');
  }

  fs.createReadStream(filePath).pipe(res);
}));
*/
















































