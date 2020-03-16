const router = require('express').Router();

const {getHash} = require('~/database/interactions/hash');
const {jsonResponse} = require('~/helpers/jres');
const {createRandomKey} = require('~/helpers/createRandomKey');
const {generateJwtPair, verifyJwt} = require('~/helpers/jwt');
const {
    createAdmin,
    getAdminByName,
} = require('~/database/interactions/admin');

const errors = require('./errors');

router.post('/register/:hash', async (req, res) => {
    const {hash} = req.params;
    if (!hash) {
        jsonResponse(res, 400, {ok: false, error: errors.NO_HASH});
        return;
    }

    const savedHash = await getHash(hash);
    if (!savedHash) {
        jsonResponse(res, 401, {ok: false, error: errors.INVALID_HASH});
        return;
    }

    const {name, password} = req.body;

    if (!name || !password) {
        jsonResponse(res, 400, {ok: false, error: errors.INVALID_PARAMS});
        return;
    }

    const doesAdminExist = await getAdminByName(name);
    if (doesAdminExist) {
        jsonResponse(res, 400, {ok: false, error: errors.DUPLICATE_NAME});
        return;
    }

    await createAdmin(name, password);

    await savedHash.remove();

    jsonResponse(res, 200, {ok: true});
});

router.post('/login', async (req, res) => {
    const {name, password} = req.body;
    if (!name || !password) {
        jsonResponse(res, 400, {ok: false, error: errors.INVALID_PARAMS});
        return;
    }

    const admin = await getAdminByName(name);
    if (!admin) {
        jsonResponse(res, 404, {ok: false, error: errors.USER_NOT_FOUND});
        return;
    }

    const isPasswordValid = await admin.validatePassword(password);
    if (!isPasswordValid) {
        jsonResponse(res, 400, {ok: false, error: errors.INVALID_PASSWORD});
        return;
    }

    const userId = admin.id;

    // генерирую пару токенов
    const csrf = createRandomKey();
    const {refreshJwt, accessJwt} = generateJwtPair(userId, csrf);

    // ставлю куку с токеном, она является основной
    res.cookie('jwt', refreshJwt, {httpOnly: false, maxAge: 30 * 24 * 60 * 60 * 100});

    jsonResponse(
        res,
        200,
        {
            ok: true,
            refreshJwt,
            accessJwt,
        },
    );

});

router.post('/refreshTokens', async (req, res) => {
    const {jwt: refreshToken} = req.cookies;
    const {csrf} = req.body;

    if (!refreshToken || !csrf) {
        jsonResponse(res, 400, {ok: false, error: 'Нет данных для входа'});
        return;
    }

    let tokenPayload;
    try {
        tokenPayload = verifyJwt(refreshJwt);
    } catch {
        jsonResponse(res, 400, {ok: false, error: 'Невалидный токен'});
        return;
    }

    const {csrf: tokenCsrf} = tokenPayload;

    if (tokenCsrf !== csrf) {
        jsonResponse(res, 400, {ok: false, error: 'Не совпадают данные куки и токена'});
        return;
    }

    const {accessJwt, refreshJwt} = generateJwtPair();

    res.cookie('jwt', refreshJwt, {});
    jsonResponse(res, 200, {
        ok: true,
        accessJwt,
        refreshJwt,
    });
});

module.exports = router;
