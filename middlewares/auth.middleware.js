const User = require('../models/user.model');

module.exports.requireAuth = async (req, res, next) => {
    if (!req.signedCookies.userId) {
        res.redirect('/login');
        return;
    } 

    // const user = db.get('users').find({ 
    //     id: req.signedCookies.userId 
    // }).value();
    var user = await User.find({_id: req.signedCookies.userId});
    
    if (!user) {
       res.redirect('/login');
       return; 
    }

    res.locals.user = user;

    next();
};