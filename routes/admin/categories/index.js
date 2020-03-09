const router = require('express').Router();
const multipartMiddleware = require('connect-multiparty')();
const path = require('path');

const {jsonResponse} = require('~/helpers/jres');

const {
    getAllCategories,
    createCategory,
    deleteCategory,
    updateCategory,
} = require('~/database/interactions/category');
const {
    getCategoryPreview,
} = require('~/database/getters/category');
const {saveImage} = require('~/apis/imageHost');

const {
    SERVER_ERROR,
    NAME_REQIRED,
    BAD_FORMAT,
    NOTHING_TO_DELETE,
} = require('./errors');

router.get('/previews', async (req, res) => {
    try {
        const categories = await getAllCategories();
        const categoriesPreviews = categories.map(getCategoryPreview);

        jsonResponse(
            res,
            200,
            {
                ok: true,
                data: categoriesPreviews,
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

router.post(
    '/',
    multipartMiddleware,
    async (req, res) => {
        const {name} = req.body;
        const {image} = req.files;

        if (!name || !image) {
            jsonResponse(res, 400, {ok: false, error: NAME_REQIRED});
            return;
        }

        const {type: fileType, path: tempPath} = image;
        const [type, extension] = fileType.split('/');

        if (type === 'image/') {
            jsonResponse(res, 400, {ok: false, error: BAD_FORMAT});
            return;
        }

        const imageName = await saveImage(tempPath, extension);

        try {
            const category = await createCategory(name, imageName);
            jsonResponse(res, 200, {ok: true, category: getCategoryPreview(category)});
        } catch {
            jsonResponse(res, 500, {ok: false, error: SERVER_ERROR});
        }
    },
);

router.delete('/:categoryId', async (req, res) => {
    const {categoryId} = req.params;
    let deletionResult;
    try {
        deletionResult = await deleteCategory(categoryId);
    } catch {
        jsonResponse(res, 500, {ok: false, error: SERVER_ERROR});
    }

    const {deletedCount} = deletionResult;
    if (!deletedCount) {
        jsonResponse(
            res,
            400,
            {
                ok: false,
                error: NOTHING_TO_DELETE,
            },
        );
    }

    jsonResponse(
        res,
        200,
        {
            ok: true,
        },
    );
});

router.put('/:categoryId', async (req, res) => {
    const {categoryId} = req.params;
    const {updates} = req.body;

    await updateCategory();
});


module.exports = router;
