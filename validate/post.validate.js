const request = require('request');

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

module.exports.download = async (req, res, next) => {
    var captcha = req.body['g-recaptcha-response'];
    
    if(!captcha) {
        req.flash('errors', 'Please select captcha.');
        res.render('posts/download', {
            flash: {errors: req.flash('errors')}
        });
        return;
      }
    
      // Secret Key
      const secretKey = '6LcLSBETAAAAAHKKptZbdAENAwUfW0W2lHerNKNk';
    
      // Verify URL
      const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.connection.remoteAddress}`;
      
      // Make Request To VerifyURL
      request(verifyUrl, (err, response, body) => {
        body = JSON.parse(body);
    
        // If Not Successful
        if(body.success == false){
          req.flash('errors', 'Failed captcha verification.');
          res.render('posts/download', {
            flash: {errors: req.flash('errors')}
          });
          return;
        }
  
        next();
  
      });
};