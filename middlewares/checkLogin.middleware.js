const db = require('../db');

var isLogin = false;
var checkLoginStatus = function(req, res){
    isLogin = false;
    if(req.signedCookies.userId){
        isLogin = true;
    }
};

module.exports.checkLogin = (req, res, next) => {
    checkLoginStatus(req, res);
    const user = db.get('users').find({ 
        id: req.signedCookies.userId 
    }).value();
    loginStatus = isLogin;
    res.locals.user = user;

    next();
};