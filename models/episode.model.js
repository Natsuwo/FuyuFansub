const mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var episodeSchema = new mongoose.Schema({
    postId: ObjectId,
    epNum: String,
    fileName: String,
    fileSize: Number,
    date: Number,
    flag: String,
    link_download: String,
    count: Number
});

episodeSchema.index({ fileName: 'text' });
module.exports = mongoose.model('Episode', episodeSchema);