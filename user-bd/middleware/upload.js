const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(__dirname, '..', 'secure_uploads', 'materials');
    console.log('MULTER destination called for', req.method, req.originalUrl, 'originalname:', file && file.originalname);
    try { fs.mkdirSync(uploadPath, { recursive: true }); } catch (e) { return cb(e); }
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    console.log('MULTER filename ->', uniqueName, 'for original:', file.originalname);
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'video/mp4'];
  console.log('MULTER fileFilter checking mimetype:', file.mimetype);
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // do NOT call cb with an Error — set a flag and reject the file politely
    req.fileValidationError = 'Only PDF and MP4 files are allowed';
    console.warn('MULTER fileFilter rejected file:', file.originalname, file.mimetype);
    cb(null, false); // reject file but let route handle the missing file
  }
};

const upload = multer({ storage, fileFilter });

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




















