const express = require('express');
const multer = require('multer');
const router = express.Router();
const controller = require('../controllers/post.controller');
const validate = require('../validate/post.validate');
const md5 = require('md5');
const authMiddleware = require('../middlewares/auth.middleware');
const cloudinary = require('cloudinary');

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + md5(file.originalname) + file.originalname);
    }
  });
const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};
  
const upload = multer({ storage, fileFilter: imageFilter });

cloudinary.config({
  cloud_name: 'dtmygdk4v',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get('/add-post', authMiddleware.requireAuth, controller.addPost);

router.get('/view/:postId', controller.view);

router.get('/edit/:postId', authMiddleware.requireAuth, controller.edit);

router.get('/add-episode', authMiddleware.requireAuth, controller.addEpisode);

router.get('/download/:episodeId', validate.download, controller.download);

router.get('/list-project', controller.project);

router.get('/logout', controller.logout);

router.post('/add-post',
    authMiddleware.requireAuth,
    upload.single('thumbnail'), 
    validate.addPost, 
    controller.postAddPost
);

router.post('/edit/:postId',
    authMiddleware.requireAuth,
    controller.postEdit
);

router.post('/episode/:epId/delete',
    authMiddleware.requireAuth,
    validate.deleteEpisode,
    controller.deleteEpisode
);

router.post('/add-episode',
    authMiddleware.requireAuth,
    validate.addEpisode,
    controller.postAddEpisode
);

router.post('/download/:episodeId', validate.download, controller.download);

router.post('/delete/:postId', authMiddleware.requireAuth, validate.delete, controller.delete);

module.exports = router;