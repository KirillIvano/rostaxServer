const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    fingerprint: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
});

const SessionModel = mongoose.model('adminSession', SessionSchema);

module.exports = {
    SessionSchema,
    SessionModel,
};
