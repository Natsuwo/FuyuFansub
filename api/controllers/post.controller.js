const Post = require('../../models/post.model');

module.exports.index = async (req, res) => {
    var posts = await Post.find();
    res.json(posts);
};
