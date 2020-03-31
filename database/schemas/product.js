const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    certificate: {
        type: String,
        required: false,
    },
    shortDescription: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    description: {
        type: [{
            name: String,
            items: [{name: String, value: String}],
        }],
        default: [],
    },
});

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = {
    ProductSchema,
    ProductModel,
};
