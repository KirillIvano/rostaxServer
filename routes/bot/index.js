const router = require('express').Router();

const {
    checkIfHashExists,
    createHash,
} = require('~/database/interactions/hash');

router.post('/checkHash', async (req, res) => {
    const {hash} = req.query;
    if (!hash) {
        res.status(400);
        res.json({ok: false, error: 'Hash is required'});
        return;
    }

    const exists = await checkIfHashExists(hash);
    if (!exists) {
        res.status(403);
        res.json({ok: false, error: 'Invalid hash'});
        return;
    }

    res.status(200);
    res.json({ok: true});
});

router.post('/getRegisterRef', async (req, res) => {
    let hash;
    try {
        hash = await createHash();
    } catch(e) {
        res.status(500);
        res.json({ok: false, error: 'Some server error'});
        return;
    }

    res.status(200);
    res.json({ok: true, ref: hash});
});

module.exports = router;
