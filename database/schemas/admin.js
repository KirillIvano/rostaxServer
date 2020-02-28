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


AdminSchema.methods.setPassword = async function(password){
    const passwordSalt = crypto.randomBytes(16).toString('hex');
    this.passwordHash = await createPasswordHash(password, passwordSalt);
    this.passwordSalt = passwordSalt;
};

AdminSchema.methods.validPassword = async function(password) {
    const hash = await createPasswordHash(password, this.passwordSalt);
    return this.passwordHash === hash;
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

const AdminModel = mongoose.model('admin', AdminSchema);

module.exports = {
    AdminModel,
};
