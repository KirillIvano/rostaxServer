const router = require('express').Router();
const multipartMiddleware = require('connect-multiparty')();

const {
    createProduct,
    getProductByIds,
    deleteProduct,
    updateDescription,
} = require('~/database/interactions/products');
const {getCategoryById} = require('~/database/interactions/category');
const {getCategory} = require('~/database/getters/category');

const {jsonResponse} = require('~/helpers/jres');
const {
    saveImage,
    replaceImage,
    deleteImage,
} = require('~/apis/imageHost');

router.get('/:categoryId', async (req, res) => {
    const {categoryId} = req.params;

    let category;
    try {
        category = await getCategoryById(categoryId);
    } catch (e) {
        jsonResponse(res, 500, {ok: false, error: 'Не получилось получить доступ к данной категории'});
        return;
    }

    if (!category) {
        jsonResponse(res, 404, {ok: false, error: 'Такой категории не найдено'});
        return;
    }

    jsonResponse(
        res,
        200,
        {
            ok: true,
            category: getCategory(category),
        },
    );
});

router.post(
    '/:categoryId',
    multipartMiddleware,
    async (req, res) => {
        const {categoryId} = req.params;

        const {image, certificate} = req.files;
        const {name, shortDescription, type} = req.body;

        const doAllFieldsExist =  name && shortDescription && type;

        if (!doAllFieldsExist) {
            jsonResponse(res, 400, {error: 'Все параметры обязательны!'});
            return;
        }

        let imageName = process.env.IMAGE_PLACEHOLDER;

        if (image) {
            const {type: fileType, path: tempPath} = image;
            const [extensionType, extension] = fileType.split('/');

            if (extensionType !== 'image') {
                jsonResponse(res, 400, {ok: false, error: 'Ожидается передача изображения'});
                return;
            }

            try {
                imageName = await saveImage(tempPath, extension);
            } catch(e) {
                jsonResponse(res, 500, {ok: false, error: 'Не получилось сохранить картинку, обратитесь к админу'});
                return;
            }
        }

        let certificateName = process.env.CERTIFICATE_PLACEHOLDER;

        if (certificate) {
            const {type: fileType, path: tempPath} = certificate;
            const extension = fileType.split('/')[0];

            try {
                certificateName = await saveImage(tempPath, extension);
            } catch(e) {
                jsonResponse(res, 500, {ok: false, error: 'Не получилось сохранить сертификат, обратитесь к админу'});
                return;
            }
        }

        let product;
        try {
            product = await createProduct(categoryId, {
                name,
                shortDescription,
                type,
                image: imageName,
                certificate: certificateName,
            });
        } catch {
            jsonResponse(res, 500, {ok: false, error: 'Не удалось сохранить продукт'});
            return;
        }

        if (!product) {
            jsonResponse(res, 500, {ok: false, error: 'Не удалось найти соответствующую категорию'});
            return;
        }

        jsonResponse(res, 200, {ok: true, product});
    });

router.put('/description', async (req, res) => {
    const {categoryId, productId} = req.query;
    const {description} = req.body;

    const updatedProduct = await updateDescription(categoryId, productId, description);

    if (!updatedProduct) {
        jsonResponse(res, 400, {error: 'Не существует такой категории или продукта'});
        return;
    }

    jsonResponse(
        res,
        200,
        {
            ok: true,
            product: updatedProduct,
        },
    );
});

router.put('/main/:categoryId/:productId/');

router.delete(
    '/:categoryId/:productId',
    async (req, res) => {
        const {categoryId, productId} = req.params;
        const product = getProductByIds(categoryId, productId);

        if (!product) {
            jsonResponse(res, 404, {error: 'Продукт не найден'});
            return;
        }

        try {
            const isDeleted = await deleteProduct(categoryId, productId);
            if (!isDeleted) {
                jsonResponse(res, 404, {error: 'Продукт не найден'});
                return;
            }
        } catch {
            jsonResponse(res, 500, {error: 'Ошибка сохранения'});
            return;
        }

        const {certificate, image} = product;
        try {
            image === process.env.IMAGE_PLACEHOLDER && deleteImage(image);
            certificate === process.env.CERTIFICATE_PLACEHOLDER && deleteImage(certificate);
        } catch {
            console.log('deleting error');
        }

        jsonResponse(res, 200, {ok: true});
    },
);

module.exports = router;
