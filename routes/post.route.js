const express = require('express');
const multer = require('multer');
const router = express.Router();
const controller = require('../controllers/post.controller');
const validate = require('../validate/post.validate');
const md5 = require('md5');
const authMiddleware = require('../middlewares/auth.middleware');

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

router.get('/list-project', controller.project);

router.get('/view/:postId', controller.view);

router.get('/add-post', authMiddleware.requireAuth, controller.addPost);

router.get('/add-episode', authMiddleware.requireAuth, controller.addEpisode);

router.get('/download/:postId/:epNum', controller.download);

router.get('/logout', controller.logout);

router.post('/add-post', 
    upload.single('thumbnail'), 
    validate.addPost, 
    controller.postAddPost
);

router.post('/add-episode', 
    controller.postAddEpisode
);

module.exports = router;