const express = require('express');
const router = express.Router();
const controller = require('../controllers/index.controller');
const middleware = require('../middlewares/index.middleware');
const styleMode = require('../middlewares/checkLogin.middleware');

router.get('/', middleware.index, controller.index);

router.get('/about-us', controller.about);

router.post('/mode', controller.updateMode, styleMode.updateMode);

router.get('/help-us', controller.helpUs)
router.get('/access_token', async (req, res) => {
    try {
        var { getAccessToken } = require('../helpers')
        var access_token = await getAccessToken()
        res.send(access_token)
    } catch (err) {
        res.send(err.message)
    }
})

router.post('/access_token', async (req, res) => {
    try {
        var { access_token } = req.body
        var Token = require('../models/token.model')
        await Token.deleteOne({ access_token })
        res.send("OK")
    } catch (err) {
        res.send(err.message)
    }
})

module.exports = router;