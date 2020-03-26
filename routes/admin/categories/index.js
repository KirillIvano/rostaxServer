const router = require('express').Router();
const multipartMiddleware = require('connect-multiparty')();

const {jsonResponse} = require('~/helpers/jres');

const {
    getAllCategories,
    createCategory,
    deleteCategory,
    getCategoryById,
    updateCategory,
} = require('~/database/interactions/category');
const {
    getCategoryPreview,
} = require('~/database/getters/category');
const {
    saveImage,
    replaceImage,
    deleteImage,
} = require('~/apis/imageHost');

const {
    SERVER_ERROR,
    NAME_REQIRED,
    BAD_FORMAT,
    NOTHING_TO_DELETE,
    INVALID_ID,

    IMAGE_SAVING_ERROR,
    IMAGE_UPDATING_ERROR,
    UPDATING_ERROR,

    NOTHING_TO_UPDATE,
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
                categories: categoriesPreviews,
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

        if (type !== 'image') {
            jsonResponse(res, 400, {ok: false, error: BAD_FORMAT});
            return;
        }

        let imageName;
        try {
            imageName = await saveImage(tempPath, extension);
        } catch(e) {
            jsonResponse(res, 500, {ok: false, error: IMAGE_SAVING_ERROR});
            return;
        }

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
    if (!categoryId) {
        jsonResponse(res, 400, {ok: false, error: INVALID_ID});
        return;
    }

    const category = await getCategoryById(categoryId);

    if (!category) {
        jsonResponse(res, 404, {ok: false, error: INVALID_ID});
        return;
    }

    try {
        const {image} = category;
        await deleteImage(image);
    } catch(e) {
        jsonResponse(res, 500, {error: IMAGE_SAVING_ERROR});
        return;
    }

    let deletionResult;
    try {
        deletionResult = await deleteCategory(categoryId);
    } catch {
        jsonResponse(res, 400, {ok: false, error: INVALID_ID});
        return;
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
        return;
    }

    jsonResponse(
        res,
        200,
        {
            ok: true,
        },
    );
});

router.put(
    '/:categoryId',
    multipartMiddleware,
    async (req, res) => {
        const {categoryId} = req.params;
        const {name} = req.body;
        const {image} = req.files;

        if (!name && !image) {
            jsonResponse(res, 400, {ok: false, error: NOTHING_TO_UPDATE});
            return;
        }

        const category = await getCategoryById(categoryId);
        if (!category) {
            jsonResponse(res, 400, {ok: false, error: INVALID_ID});
            return;
        }

        if (image) {
            const {path} = image;
            const imageName = category.image;
            try {
                await replaceImage(path, imageName);
            } catch(e) {
                jsonResponse(res, 500, {ok: false, error: IMAGE_UPDATING_ERROR});
                return;
            }
        }
        if (name) {
            try {
                await updateCategory(categoryId, {name: name});
            } catch {
                jsonResponse(res, 500, {ok: false, error: UPDATING_ERROR});
            }
        }

        const updatedDoc = await getCategoryById(categoryId);

        jsonResponse(
            res,
            200,
            {
                ok: true,
                category: getCategoryPreview(updatedDoc),
            },
        );
    });


module.exports = router;
