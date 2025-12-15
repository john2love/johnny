const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadRoot = path.resolve(__dirname, '..', 'secure_uploads', 'materials');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    try {
      fs.mkdirSync(uploadRoot, { recursive: true });
      cb(null, uploadRoot);
    } catch (err) {
      console.error('[UPLOAD] Failed to create upload directory', {
        path: uploadRoot,
        error: err.message,
      });
      cb(err);
    }
  },

  filename(req, file, cb) {
    try {
      const ext = path.extname(file.originalname).toLowerCase();
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, uniqueName);
    } catch (err) {
      console.error('[UPLOAD] Filename generation failed', {
        originalName: file?.originalname,
        error: err.message,
      });
      cb(err);
    }
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'video/mp4'];

  if (!allowedTypes.includes(file.mimetype)) {
    console.warn('[UPLOAD] Rejected file type', {
      originalName: file.originalname,
      mimetype: file.mimetype,
    });
    req.fileValidationError = 'Only PDF and MP4 files are allowed';
    return cb(null, false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB
  },
});

module.exports = upload;








// const multer = require('multer');
// const path = require('path');
// const fs = require('fs'); // ✅ Added to ensure directory exists

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // ✅ Use absolute path and ensure directory exists
//     const uploadPath = path.join(__dirname, '../secure_uploads/materials');
//     try {
//       fs.mkdirSync(uploadPath, { recursive: true }); // safe if exists
//     } catch (e) {
//       // If directory creation fails, propagate a clear error to multer
//       return cb(e);
//     }
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
//     cb(null, uniqueName);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['application/pdf', 'video/mp4'];

//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true); // ✅ Accept file
//   } else {
//     cb(new Error('❌ Only PDF and MP4 files are allowed'), false); // ❌ Reject file with error
//   }
// };

// const upload = multer({ storage, fileFilter });

// module.exports = upload;




















