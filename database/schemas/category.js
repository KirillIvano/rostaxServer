const mongoose = require('mongoose');
const {ProductSchema} = require('./product');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
        default: 'placeholder.png',
    },
    products: {
        type: [ProductSchema],
        default: [],
    },
});

const CategoryModel = mongoose.model('Category', CategorySchema);

module.exports = {
    CategoryModel,
};
