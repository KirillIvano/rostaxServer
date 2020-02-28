const {AdminModel} = require('~/database/schemas/admin');

const createAdmin = async (name, password) => {
    const admin = new AdminModel();
    admin.name = name;
    await admin.setPassword(password);

    return admin.save();
};

const getAdminByName = name => AdminModel.findOne({name: name});

const getAdminById = id => AdminModel.findById(id);

module.exports = {
    createAdmin,
    getAdminByName,
    getAdminById,
};
