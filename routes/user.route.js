const express = require('express');
const router = express.Router();

router.get('/Abouts', (req, res) => {
    res.render('users/index', {
        users: db.get('users').value()
    });
});

module.exports = router;