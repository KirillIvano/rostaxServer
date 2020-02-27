const mongoose = require('mongoose');
const crypto = require('crypto');

const HashSchema = new mongoose.Schema({
    value: {
        type: String,
        unique: true,
        required: true,
    },
});

HashSchema.methods.generateHash = async function() {
    do {
        this.value = crypto.randomBytes(16).toString('hex');
    } while (await HashModel.findOne({value: this.value}));
};

const HashModel = mongoose.model('hash', HashSchema);

module.exports = {
    HashModel,
};
