const crypto = require('crypto');

const createRandomKey = () =>
    crypto.randomBytes(16).toString('hex');

module.exports = {
    createRandomKey,
};
