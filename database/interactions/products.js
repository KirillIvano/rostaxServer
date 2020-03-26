const {CategoryModel} = require('~/database/schemas/category');
const {getClientProduct} = require('~/database/getters/products');

const getProductsByCategoryId = async categoryId => {
    const category = await CategoryModel.findById(categoryId);
    if (!category) return null;

    const {products} = category;
    return products.map(getClientProduct);
};

module.exports = {
    getProductsByCategoryId,
};
