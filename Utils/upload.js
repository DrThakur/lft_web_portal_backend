const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Ensure uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      return cb(null, `${Date.now()} - ${file.originalname}`);
    },
  });
  

  // File filter
const allowedFileTypes = new Set([
    'jpeg',
    'jpg',
    'png',
    'csv',
    'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]);

  
  //Multer filter
  const multerFilter = (req, file, cb) => {
    const fileType = file.mimetype.split('/')[1];
    if (allowedFileTypes.has(fileType)) {
      cb(null, true);
    } else {
      cb(new Error('Not an allowed file type'), false);
    }
  };
  

  const upload = multer({ storage: storage, fileFilter: multerFilter }).single('file');;

  module.exports = upload;