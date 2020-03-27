const {CategoryModel} = require('~/database/schemas/category');
const {ProductModel} = require('~/database/schemas/product');
const {getClientProduct} = require('~/database/getters/products');

const getProductsByCategoryId = async categoryId => {
    const category = await CategoryModel.findById(categoryId);
    if (!category) return null;

    const {products} = category;
    return products.map(getClientProduct);
};

const validateProduct = async product => {
    const productDoc = new ProductModel(product);
    await productDoc.validate();
};

const createProduct = async (categoryId, product) => {
    console.log(categoryId);
    const category = await CategoryModel.findById(categoryId);
    const productDoc = await new ProductModel(product);

    category.products.push(productDoc);

    await category.save();

    return productDoc;
};

module.exports = {
    getProductsByCategoryId,
    validateProduct,
    createProduct,
};
