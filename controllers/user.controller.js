const db = require('../db');

module.exports.profile =  (req, res) => {
    res.render('users/index', {
        users: db.get('users').value()
    });
};