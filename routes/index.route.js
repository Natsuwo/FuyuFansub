const express = require('express');
const router = express.Router();
const controller = require('../controllers/index.controller');
const middleware = require('../middlewares/index.middleware');
const styleMode = require('../middlewares/checkLogin.middleware');

router.get('/', middleware.index, controller.index);

router.get('/about-us', controller.about);

router.post('/mode', controller.updateMode, styleMode.updateMode);

module.exports = router;