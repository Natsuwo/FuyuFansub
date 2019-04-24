const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    post_title: String,
    submitter: String,
    file_size: String,
    link_download: String
});

const User = mongoose.model('User', userSchema, 'posts');

module.exports = User;