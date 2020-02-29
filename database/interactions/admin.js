const {AdminModel} = require('~/database/schemas/admin');
const {SessionModel} = require('~/database/schemas/session');

const createAdmin = async (name, password) => {
    const admin = new AdminModel();
    admin.name = name;
    await admin.setPassword(password);

    return admin.save();
};

const getAdminByName = name => AdminModel.findOne({name: name});

const getAdminById = id => AdminModel.findById(id);

const createSession = async ({
    userId,
    refreshToken,
    fingerprint,
}) => {
    const session = new SessionModel({userId, refreshToken, fingerprint});

    await AdminModel.updateOne(
        {
            _id: userId,
        },
        {
            $push: {
                sessions: session,
            },
        },
    );
};

module.exports = {
    createAdmin,
    getAdminByName,
    getAdminById,
    createSession,
};


