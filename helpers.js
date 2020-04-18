const crypto = require('crypto')
const algorithm = 'aes-256-cbc'
const IV_LENGTH = 16;
const axios = require('axios')
var key = process.env.CRYPTOKEY
key = key.substring(0, 32)
var access_token;
var expiry_date;
module.exports = {
    encrypt(text) {
        try {
            let iv = crypto.randomBytes(IV_LENGTH);
            let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
            let encrypted = cipher.update(text);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            return iv.toString('hex') + ':' + encrypted.toString('hex');
        } catch (err) {
            return false
        }
    },
    decrypt(text) {
        try {
            let textParts = text.split(':');
            let iv = Buffer.from(textParts.shift(), 'hex');
            let encryptedText = Buffer.from(textParts.join(':'), 'hex');
            let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        } catch (err) {
            return false;
        }
    },
    async getAccessToken() {
        var timeNow = (new Date).getTime()
        if (expiry_date && expiry_date > timeNow) {
            return access_token
        } else
            return await module.exports.refreshToken()
    },
    async refreshToken() {
        console.log('co chay')
        var client_id = process.env.CLIENT_ID
        var client_secret = process.env.CLIENT_SECRET
        var refresh_token = process.env.REFRESH_TOKEN
        var grant_type = 'refresh_token'
        var form = { client_id, client_secret, refresh_token, grant_type }
        var response = await axios.post('https://accounts.google.com/o/oauth2/token', form)
        var time = new Date()
        expiry_date = time.setSeconds(time.getSeconds() + response.data.expires_in)
        access_token = response.data.access_token
        return await module.exports.getAccessToken()
    }
}