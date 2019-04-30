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

module.exports.addEpisode = async (req, res, next) => {
    if(!req.body.postId) {
        req.flash('errors', 'Parent post is required!');
    }
    if(!req.body.epNum) {
        req.flash('errors', 'Please enter the number of episode');
    }
    if(!req.body.link_download) {
        req.flash('errors', 'Link download is required!');
    }
    
    if(req.body.link_download && req.body.epNum && req.body.postId) {
        req.flash('notice', 'Upload Success!');
        next();
    }

    res.redirect('back');
};

module.exports.delete = async (req, res, next) => {
    if(req.body.delete_post) {
        req.flash('notice', 'Deleted Success!')
    }

    next();
};

module.exports.deleteEpisode = async (req, res, next) => {
    if(req.body.delete_episode) {
        req.flash('notice', 'Deleted Success!')
    }
    next();
};