const router = require('express').Router();
const multipartMiddleware = require('connect-multiparty')();

const {getProductsByCategoryId, createProduct} = require('~/database/interactions/products');
const {jsonResponse} = require('~/helpers/jres');
const {
    saveImage,
    replaceImage,
    deleteImage,
} = require('~/apis/imageHost');

router.get('/:categoryId', async (req, res) => {
    const {categoryId} = req.params;

    let products;
    try {
        products = await getProductsByCategoryId(categoryId);
    } catch (e) {
        jsonResponse(res, 500, {ok: false, error: 'Не получилось получить продукты'});
        return;
    }

    if (!products) {
        jsonResponse(res, 404, {ok: false, error: 'Такой категории не найдено'});
        return;
    }

    jsonResponse(res, 200, {ok: true, products});
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

        let imageName = 'placeholder.png';

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

        let certificateName = 'cert.png';

        if (certificate) {
            const {type: fileType, path: tempPath} = image;
            const extension = fileType.split('/')[0];

            try {
                certificateName = await saveImage(tempPath, extension);
            } catch(e) {
                jsonResponse(res, 500, {ok: false, error: 'Не получилось сохранить сертификат, обратитесь к админу'});
                return;
            }
        }

        const product = await createProduct(categoryId, {
            name,
            shortDescription,
            type,
            image: imageName,
            certificate: certificateName,
        });

        jsonResponse(res, 200, {ok: true, product});
    });

router.put('/:categoryId/:productId');
router.delete('/:categoryId/:productId');

module.exports = router;
