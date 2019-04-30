const express = require('express');
const router = express.Router();
const controller = require('../controllers/index.controller');
const middleware = require('../middlewares/index.middleware');

router.get('/', middleware.index, controller.index);

module.exports = router;