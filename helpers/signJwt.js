const jwt = require('jsonwebtoken');

const doSignJWT = (expiryDate, ...params) =>
    jwt.sign(
        {
            ...params,
            exp: Math.floor(expiryDate.getTime()/1000),
        },
        process.env.SERVER_SECRET,
    );

const generateTemporaryJWT = _id => {
    const expiry = new Date();
    expiry.setDate(expiry.getMinutes() + 10);

    return doSignJWT(expiry, {_id});
};

const generateRefreshJWT = (_id, csrf) => {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return doSignJWT(expiry, {_id, csrf});
};

const generateJwtPair = (_id, csrf) => ({
    accessJwt: generateTemporaryJWT(_id),
    refreshJwt: generateRefreshJWT(_id, csrf),
});

module.exports = {
    generateTemporaryJWT,
    generateRefreshJWT,
    generateJwtPair,
};
