const {pick} = require('ramda');
const {getClientProduct} = require('./products');

const previewFields = ['name', 'image', 'id'];
const categoryFields = ['name', 'image', 'id','products'];

const getCategoryPreview = categoryDoc => pick(previewFields, categoryDoc);
const getCategory = categoryDoc => {
    const category = pick(categoryFields, categoryDoc);
    let products = category.products || [];

    products = products.map(getClientProduct);
    category.products = products;

    return category;
};
module.exports = {
    getCategoryPreview,
    getCategory,
};
