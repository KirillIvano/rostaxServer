const {HashModel} = require('./../schemas/hash');

const removeHash = async id => {
    return HashModel.deleteOne({_id: id});
};

const checkIfHashExists = async hash => {
    const found = await HashModel.findOne({value: hash});
    if (!found) {
        return false;
    }
    return found;
};

const createHash = async () => {
    const hash = new HashModel();
    await hash.generateHash();
    await hash.save();

    const {value} = hash;
    return value;
};

module.exports = {
    removeHash,
    checkIfHashExists,
    createHash,
};
