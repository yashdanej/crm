const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
  destination: function(req, file, cb){
    console.log(path.extname(file.originalname));
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb){
    let ext = path.extname(file.originalname);
    let name = path.basename(file.originalname, ext);
    cb(null, name + '_' + Date.now() + ext);
  }
});

var upload = multer({
  storage: storage,
  fileFilter: function(req, file, callback){
    // const allowedTypes = [
    //   'image/png', 'image/jpg', 'image/jpeg',
    //   'application/pdf', 
    //   'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    //   'application/vnd.ms-powerpoint', // .ppt
    //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    //   'application/vnd.ms-excel', // .xls
    //   'text/csv' // .csv
    // ];
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 100 // 100 MB
  }
});

module.exports = { upload };
