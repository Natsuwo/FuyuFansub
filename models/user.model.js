const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    style_mode: String
});

var User = mongoose.model('User', userSchema, 'users');

module.exports = User;