const User = require('../models/user.model');

var isLogin = false;
var checkLoginStatus = function(req, res){
    isLogin = false;
    if(req.signedCookies.userId){
        isLogin = true;
    }
};

module.exports.checkLogin = async (req, res, next) => {
    checkLoginStatus(req, res);
    var user = await User.findOne({_id: req.signedCookies.userId});
    loginStatus = isLogin;
    res.locals.userName = user;
    res.locals.query = req.query;
    res.locals.action = '/';

    next();
};

module.exports.updateMode = async (req, res, next) => {
    mode = req.signedCookies.style_mode ? req.signedCookies.style_mode : 'light-mode';

    if(loginStatus) {
        var user = await User.findOne({_id: req.signedCookies.userId});
        mode = user.style_mode;
    }

    if(!mode) {
        mode = 'light-mode';
    }

    classes = mode;
    
    next();
};