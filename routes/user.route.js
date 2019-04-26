const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const checkLoginMiddleware = require('../middlewares/checkLogin.middleware');

router.get('/profile', checkLoginMiddleware.checkLogin, authMiddleware.requireAuth, controller.profile);

module.exports = router;