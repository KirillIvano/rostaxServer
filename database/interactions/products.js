const {CategoryModel} = require('~/database/schemas/category');
const {ProductModel} = require('~/database/schemas/product');
const {getClientProduct} = require('~/database/getters/products');

const getProductsByCategoryId = async categoryId => {
    const category = await CategoryModel.findById(categoryId);
    if (!category) return null;

    const {products} = category;
    return products.map(getClientProduct);
};

const getProductByIds = async (categoryId, productId) => {
    const category = await CategoryModel.findById(categoryId);
    if (!category) return null;

    return category.products.id(productId);
};

const deleteProduct = async (categoryId, productId) => {
    const category = await CategoryModel.findById(categoryId);
    if (!category) return false;

    const {products} = category;

    const newProducts = products.filter(({id}) => id !== productId);

    if (newProducts.length === products.length) {
        return false;
    }

    category.products = newProducts;
    await category.save();

    return true;
};

const validateProduct = async product => {
    const productDoc = new ProductModel(product);
    await productDoc.validate();
};

const createProduct = async (categoryId, product) => {
    const category = await CategoryModel.findById(categoryId);
    if (!category) return null;
    const productDoc = await new ProductModel(product);

    category.products.push(productDoc);

    await category.save();

    return getClientProduct(productDoc);
};

const updateDescription = async (categoryId, productId, description) => {
    const category = await CategoryModel.findById(categoryId);
    if (!category) return null;
    const product = category.products.find(({id}) => id === productId);
    if (!product) return null;

    product.description = description;
    await category.save();

    return getClientProduct(product);
};

module.exports = {
    getProductsByCategoryId,
    validateProduct,
    createProduct,
    getProductByIds,
    deleteProduct,

    updateDescription,
};
