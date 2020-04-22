const mongoose = require('mongoose');

var tokenSchema = new mongoose.Schema({
    access_token: String,
    scope: String,
    token_type: String,
    expiry_date: Number,
    refresh_token: String
});

var Token = mongoose.model('Token', tokenSchema, 'token');

module.exports = Token;