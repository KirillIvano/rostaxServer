const jwt = require('jsonwebtoken');

const doSignJWT = (expiryDate, params) =>
    jwt.sign(
        {
            ...params,
            exp: Math.floor(expiryDate.getTime() / 1000),
        },
        process.env.SERVER_SECRET,
    );

const generateTemporaryJWT = id => {
    const expiry = new Date();
    expiry.setSeconds(expiry.getSeconds() + 10);

    return doSignJWT(expiry, {id});
};

const generateRefreshJWT = (id, csrf) => {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return doSignJWT(expiry, {id, csrf});
};

const generateJwtPair = (id, csrf) => ({
    accessJwt: generateTemporaryJWT(id),
    refreshJwt: generateRefreshJWT(id, csrf),
});

const verifyJwt = token => jwt.verify(token, process.env.SERVER_SECRET);

module.exports = {
    generateTemporaryJWT,
    generateRefreshJWT,
    generateJwtPair,
    verifyJwt,
};
