const db = require('../db');

module.exports = (req, res, next) => {
    if(!req.signedCookies.sessionId) {
        var sessionId = Date.now().toString();
        res.cookie('sessionId', sessionId, {
            signed: true
        });

        db.get('sessions').push({ 
            id: sessionId 
        }).write();
    }

    next();
}