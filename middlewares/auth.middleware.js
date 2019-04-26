const db = require('../db');

module.exports.requireAuth = (req, res, next) => {
    if (!req.signedCookies.userId) {
        res.redirect('/login');
        return;
    } 

    const user = db.get('users').find({ 
        id: req.signedCookies.userId 
    }).value();
    
    if (!user) {
       res.redirect('/login');
       return; 
    }
    res.locals.user = user;

    next();
};