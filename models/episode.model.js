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

var Episode = mongoose.model('Episode', episodeSchema, 'episodes');

module.exports = Episode;