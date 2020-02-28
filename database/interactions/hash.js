const {HashModel} = require('./../schemas/hash');

const getHash = hash => HashModel.findOne({value: hash});

const createHash = async () => {
    const hash = new HashModel();
    await hash.generateHash();
    await hash.save();

    const {value} = hash;
    return value;
};

module.exports = {
    getHash,
    createHash,
};
