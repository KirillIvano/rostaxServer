const crypto = require('crypto');

const createPasswordHash = (password, passwordSalt) =>
    new Promise((resolve, reject) => {
        crypto.pbkdf2(
            password,
            passwordSalt,
            1000,
            64,
            null,
            (err, pswd) =>
                err ?
                    reject(err) :
                    resolve(pswd.toString('hex')),
        );
    });

module.exports = {
    createPasswordHash,
};
