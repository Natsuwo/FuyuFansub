const mongoose = require('mongoose');

var commitSchema = new mongoose.Schema({
    commit: String
});

var Commit = mongoose.model('Commit', commitSchema, 'commit');

module.exports = Commit;