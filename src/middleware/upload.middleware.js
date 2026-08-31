const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9);

    const extension = path.extname(
      file.originalname
    );

    cb(
      null,
      uniqueName + extension
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',

    'application/pdf',

    'text/plain',

    'application/zip',
    'application/x-zip-compressed',
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error('File type is not allowed'),
      false
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter,
});

module.exports = upload;