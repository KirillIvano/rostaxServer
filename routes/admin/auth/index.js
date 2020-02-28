const router = require('express').Router();

const {checkIfHashExists} = require('~/database/interactions/hash');
const {jsonResponse} = require('~/helpers/jres');
const {
    createAdmin,
    checkAdminByName,
} = require('~/database/interactions/admin');

const errors = require('./errors');

router.post('/register/:hash', async (req, res) => {
    const {hash} = req.params;
    if (!hash) {
        jsonResponse(res, 400, {ok: false, error: errors.NO_HASH});
        return;
    }

    const isHashValid = await checkIfHashExists(hash);
    if (!isHashValid) {
        jsonResponse(res, 401, {ok: false, error: errors.INVALID_HASH});
    }

    const {name, password} = req.body;

    if (!name || !password) {
        jsonResponse(res, 400, {ok: false, error: errors.INVALID_PARAMS});
        return;
    }

    const doesAdminExist = await checkAdminByName(name);
    if (doesAdminExist) {
        jsonResponse(res, 400, {ok: false, error: errors.DUPLICATE_NAME});
        return;
    }

    const admin = await createAdmin(name, password);
    console.log(admin);
    jsonResponse(res, 200, {ok: true});
});

module.exports = router;
