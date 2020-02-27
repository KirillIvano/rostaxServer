const mongoose = require('mongoose');
const crypto = require('crypto');
// const jwt = require('jsonwebtoken');

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    passwordHash: {
        type: String,
        required: true,
    },
    passwordSalt: {
        type: String,
        required: true,
    },
});

const createPasswordHash = (password, passwordSalt) => {
    crypto.pbkdf2Sync(password, passwordSalt, 1000, 64, null).toString('hex');
};

AdminSchema.methods.setPassword = function(password){
    const passwordSalt = crypto.randomBytes(16).toString('hex');
    this.hash = createPasswordHash(password, passwordSalt);
    this.passwordSalt = passwordSalt;
};

AdminSchema.methods.validPassword = function(password) {
    const hash = createPasswordHash(password, this.passwordSalt);
    return this.hash === hash;
};

// UserSchema.methods.generateJWT = function(){
//     var expiry = new Date();
//     expiry.setDate(expiry.getDate() + 7);
//     return jwt.sign({
//         _id: this._id,
//         email: this.email,
//         name: this.name,
//         exp: parseInt(expiry.getTime()/1000),
//     }, 'secret');
// };
