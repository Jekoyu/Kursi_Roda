const crypto = require('crypto');
const bcrypt = require('bcrypt');
const configKey = require('../config/aes.config');

class EncryptDecryptClass {
    constructor() {
        this.AES_METHOD = 'aes-256-cbc';
        this.IV_LENGTH = 16;
        this.SALTROUNDS = 10;
    
        if (!configKey.KEY || configKey.KEY.length !== 32) {
            throw new Error('Invalid encryption key: Must be 32 characters');
        }
        if (!configKey.IV || configKey.IV.length !== 16) {
            throw new Error('Invalid IV: Must be 16 characters');
        }
    
        this.KEY = configKey.KEY;
        this.IV = configKey.IV;
    }
    

    encrypt(text) {
        if (!text || typeof text !== 'string') {
            throw new Error('Text untuk enkripsi tidak boleh kosong atau undefined');
        }
    
        let cipher = crypto.createCipheriv(this.AES_METHOD, Buffer.from(this.KEY), this.IV);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
    
        return encrypted;
    }
    

    decrypt(text) {
        try {
            let decipher = crypto.createDecipheriv(this.AES_METHOD, Buffer.from(this.KEY), this.IV);
            let decrypted = decipher.update(text, 'hex', 'utf8');
            decrypted += decipher.final('utf8');

            return decrypted;
        } catch (error) {
            return null;
        }
    }

    encryptBcrypt(pass) {
        return bcrypt.hashSync(pass, this.SALTROUNDS);
    }

    async checkBcrypt(text, hash) {
        return await bcrypt.compare(text, hash.replace(/^\$2y(.+)$/i, '$2a$1'));
    }

    generateCode(digit = 5) {
        let result = '';
        const characters = '0123456789';

        for (let i = 0; i < digit; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    }
}

module.exports = EncryptDecryptClass;
