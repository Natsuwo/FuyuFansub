const axios = require('axios');
const Commit = require('../models/commit.model');

module.exports.login = (req, res) => {
    const errors = [];
    res.render('auth/login', {
        csrfToken: req.csrfToken(),
        errors,
        flash: {errors: req.flash('errors')}
    });
};

module.exports.postLogin = async (req, res) => {
    res.redirect('/profile');
};

module.exports.commit = async (req, res) => {
    var commitApi = await axios.get(process.env.COMMIT);
    await Commit.updateOne({'commit': commitApi.data[0].object['sha'].slice(0, 8)});
    res.redirect('/');
};