const db = require('../db');

module.exports.profile =  (req, res) => {
    res.render('users/profile', {
        users: db.get('users').value()
    });
};