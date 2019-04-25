const express = require('express');
const multer = require('multer');
const router = express.Router();
const controller = require('../controllers/post.controller');
const validate = require('../validate/post.validate');
const md5 = require('md5');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/upload/');
    },

    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + md5(file.originalname) + file.originalname);
    }
  });
  
const upload = multer({ storage: storage });

router.get('/', controller.index);

router.get('/view/:id', controller.view);

router.get('/upload', controller.upload);

router.post('/upload', 
    upload.single('thumbnail'), 
    validate.postUpload, 
    controller.postUpload
);

module.exports = router;