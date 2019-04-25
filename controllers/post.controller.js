const db = require('../db');


module.exports.index = (req, res) => {
    posts = db.get('posts').value();  
    res.render('index', {
        posts: posts
    });
};

module.exports.view = (req, res) => {
    var id = req.params.id;
    var post = db.get('posts').find({ id: id }).value();

    res.render('posts/view', {
        post: post
    });
};

module.exports.upload = (req, res) => {
    var errors = [];
    res.render('posts/upload', {
        errors: errors
    });
};


module.exports.postUpload = (req, res) => {
    req.body.thumbnail = req.file.path.split('\\').slice(1).join('/');

    db.get('posts').push(req.body).write();
    res.redirect('/');
};