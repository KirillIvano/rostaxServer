const {HashModel} = require('./../schemas/hash');

const checkIfHashExists = async hash => {
    const found = await HashModel.findOne({value: hash});
    if (!found) {
        return false;
    }

    await HashModel.deleteOne({_id: found._id});
    return true;
};

const createHash = async () => {
    const hash = new HashModel();
    await hash.generateHash();
    await hash.save();

    const {value} = hash;
    return value;
};

module.exports = {
    checkIfHashExists,
    createHash,
};
