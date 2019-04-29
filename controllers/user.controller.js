const User = require('../models/user.model');

module.exports.profile =  async (req, res) => {
    var users = await User.find();
        res.render('users/profile', {
            users
        });
};