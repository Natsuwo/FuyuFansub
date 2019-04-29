const mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    post_title: String,
    tags: String,
    studios: String,
    description: String,
    date: Number,
    thumbnail: String,
    is_ongoing: String,
    is_completed: String,
    is_hidden: String,
    episodes: [
        {
            epNum: String,
            fileName: String,
            fileSize: String,
            date: Number,
            link_download: String,
            count: Number
        }
    ]


});

var Post = mongoose.model('Post', postSchema, 'posts');

module.exports = Post;