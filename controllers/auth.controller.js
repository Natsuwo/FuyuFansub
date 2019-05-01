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