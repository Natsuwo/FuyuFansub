const mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    post_title: String,
    tags: String,
    studios: String,
    description: String,
    date: Number,
    thumbnail: String,
    _status: String  
});

var Post = mongoose.model('Post', postSchema, 'posts');

module.exports = Post;