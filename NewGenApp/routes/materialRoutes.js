const express = require("express");
const router = express.Router();

const materialController = require("../controllers/material.controller");
const { authenticateToken, verifyAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

/* ===============================
   ADMIN: UPLOAD MATERIAL
   POST /api/materials/upload
=============================== */
router.post(
  "/upload",
  authenticateToken,
  verifyAdmin,
  upload.single("file"),
  materialController.uploadMaterial
);

/* ===============================
   ADMIN: GET ALL MATERIALS
   GET /api/materials
=============================== */
router.get(
  "/",
  authenticateToken,
  verifyAdmin,
  materialController.getMaterials
);

/* ===============================
   ADMIN: UPDATE MATERIAL STATUS
   PATCH /api/materials/:id/status
=============================== */
router.patch(
  "/:id/status",
  authenticateToken,
  verifyAdmin,
  materialController.updateMaterialStatus
);

/* ===============================
   ADMIN: DELETE MATERIAL
   DELETE /api/materials/:id
=============================== */
router.delete(
  "/:id",
  authenticateToken,
  verifyAdmin,
  materialController.deleteMaterial
);

module.exports = router;











/*
// routes/material.routes.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const asyncHandler = require('express-async-handler');

const upload = require('../middleware/upload');
const Material = require('../models/Material');
const User = require('../models/User');
const convertToHLS = require('../utils/createHLS');
const { authenticateToken, verifyAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

/* ===============================
   ADMIN: UPLOAD MATERIAL
   POST /api/admin/materials
=============================== *
router.post(
  '/admin/materials',
  authenticateToken,
  verifyAdmin,
  upload.single('file'),
  asyncHandler(async (req, res) => {

    const { title, price } = req.body;
    const file = req.file;

    if (!file || !title || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'File, title and price required'
      });
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid price'
      });
    }

    const isPDF = /pdf/i.test(file.mimetype);
    let finalPath = file.path.replace(/\\/g, '/');
    let hlsFolder = null;

    if (!isPDF) {
      hlsFolder = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const hlsDir = path.join(process.cwd(), 'uploads', 'hls', hlsFolder);
      fs.mkdirSync(hlsDir, { recursive: true });

      const playlistPath = await convertToHLS(file.path, hlsDir);
      finalPath = playlistPath.replace(/\\/g, '/');
    }

    const material = await Material.create({
      title: title.trim(),
      type: isPDF ? 'pdf' : 'video',
      price: numericPrice,
      path: finalPath,
      hlsFolder,
      isActive: true
    });

    return res.status(201).json({
      success: true,
      message: 'Material uploaded successfully',
      material
    });
  })
);

/* ===============================
   ADMIN: GET MATERIALS
   GET /api/admin/materials
=============================== *
router.get(
  '/admin/materials',
  authenticateToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {

    const materials = await Material.find({})
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      materials
    });
  })
);

/* ===============================
   ADMIN: ACTIVATE / DEACTIVATE
=============================== *
router.patch(
  '/admin/materials/:id/activate',
  authenticateToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }

    return res.json({ success: true, material });
  })
);

router.patch(
  '/admin/materials/:id/deactivate',
  authenticateToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }

    return res.json({ success: true, material });
  })
);

/* ===============================
   ADMIN: DELETE MATERIAL
=============================== *
router.delete(
  '/admin/materials/:id',
  authenticateToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {

    const material = await Material.findByIdAndDelete(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    return res.status(200).json({
      success: true,
      hlsFolder: material.hlsFolder || null
    });
  })
);

module.exports = router;
*/