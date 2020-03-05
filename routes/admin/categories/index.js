const router = require('express').Router();
const {jsonResponse} = require('~/helpers/jres');

const {
    getAllCategoriesPreviews,
    createCategory,
    deleteCategory,
    updateCategory,
} = require('~/database/interactions/category');

const {
    SERVER_ERROR,
    NAME_REQIRED,
} = require('./errors');

router.get('/', async (req, res) => {
    try {
        jsonResponse(
            res,
            200,
            {
                ok: true,
                data: await getAllCategoriesPreviews(),
            },
        );
    } catch {
        jsonResponse(
            res,
            500,
            {
                ok: false,
                error: SERVER_ERROR,
            },
        );
    }
});

router.post('/', async (req, res) => {
    const {name} = req.body;
    if (!name) {
        jsonResponse(res, 400, {ok: false, error: NAME_REQIRED});
    }
    try {
        const category = await createCategory(name);
        jsonResponse(res, 200, {ok: true, data: category});
    } catch {
        jsonResponse(res, 500, {ok: false, error: SERVER_ERROR});
    }
});

router.delete('/:categoryId', async (req, res) => {
    const {categoryId} = req.params;
    try {
        const deletionResult = await deleteCategory(categoryId);
        const {deletedCount} = deletionResult;
        jsonResponse(res, 200, {ok: true, data: {deleted: deletedCount === 1}});
    } catch {
        jsonResponse(res, 500, {ok: false, error: SERVER_ERROR});
    }
});

router.put('/:categoryId', async (req, res) => {
    const {categoryId} = req.params;
    const {updates} = req.body;

    await updateCategory();
});


module.exports = router;
