const router = require('express').Router();

const {getProductsByCategoryId} = require('~/database/interactions/products');
const {jsonResponse} = require('~/helpers/jres');

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


router.post('/:categoryId', (req, res) => {
    // certificate
    // image
    // name
    // description
    // type
});

router.put('/:categoryId/:productId');
router.delete('/:categoryId/:productId');

module.exports = router;
