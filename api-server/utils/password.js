'use strict';
const crypto = require('crypto');

module.exports = {
    validatePassword: (password) => {
        return password.length >= 6;
    },
    hashPassword: (password) => {
        let Salt = crypto.randomBytes(16).toString('base64');
        let Password = crypto.pbkdf2Sync(password, Salt, 10000, 64, 'sha512').toString('base64');
        return {Salt, Password};
    },
    verifyPassword: (Password, Salt, VerifyPassword) => {
        return Password == crypto.pbkdf2Sync(VerifyPassword, Salt, 10000, 64, 'sha512').toString('base64');
    }
};