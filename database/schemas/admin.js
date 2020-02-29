const mongoose = require('mongoose');

const {createPasswordHash} = require('~/helpers/passwordHash');
const {createRandomKey} = require('~/helpers/createRandomKey');

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
    jwts: {
        type: [String],
        default: [],
    },
});

AdminSchema.methods.setPassword = async function(password){
    const passwordSalt = createRandomKey();
    this.passwordHash = await createPasswordHash(password, passwordSalt);
    this.passwordSalt = passwordSalt;
};

AdminSchema.methods.validatePassword = async function(password) {
    const hash = await createPasswordHash(password, this.passwordSalt);
    return this.passwordHash === hash;
};

const AdminModel = mongoose.model('admin', AdminSchema);

module.exports = {
    AdminModel,
};
