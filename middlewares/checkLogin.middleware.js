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
    var user = await User.find({_id: req.signedCookies.userId});
    loginStatus = isLogin;
    res.locals.user = user;
    res.locals.query = req.query;
    res.locals.action = '/';

    next();
};