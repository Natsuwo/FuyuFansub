const crypto = require('crypto')
const algorithm = 'aes-256-cbc'
const IV_LENGTH = 16;
var key = process.env.CRYPTOKEY
key = key.substring(0, 32)
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
    }
}