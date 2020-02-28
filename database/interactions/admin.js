const {AdminModel} = require('~/database/schemas/admin');

const createAdmin = async (name, password) => {
    const admin = new AdminModel();
    admin.name = name;
    await admin.setPassword(password);

    return admin.save();
};

const checkAdminByName = async name => {
    const admin = await AdminModel.findOne({name: name});
    if (!admin) return false;

    return admin;
};

module.exports = {
    createAdmin,
    checkAdminByName,
};
