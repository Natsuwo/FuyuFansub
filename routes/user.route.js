const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/profile', authMiddleware.requireAuth, controller.profile);

module.exports = router;