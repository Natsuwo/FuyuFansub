const md5 = require('md5');

module.exports.addPost = (req, res, next) => {
    req.body.date = new Date();

    const errors = [];

    if (!req.body.post_title) {
        errors.push('Post name is required');
    }

    if (errors.length) {
        res.render('posts/add-new', {
            errors: errors
        });
        return;
    }

    next();
};