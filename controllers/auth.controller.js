const db = require('../db');

module.exports.login = (req, res) => {
    const errors = [];
    res.render('auth/login', {
        errors
    });
};

module.exports.postLogin = async (req, res) => {
    res.redirect('/profile');
};