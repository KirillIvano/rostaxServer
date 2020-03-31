const mongoose = require('mongoose');

const DescriptionItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        require: true,
    },
});

const DescriptionSectionSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    items: {
        type: [DescriptionItemSchema],
        default: () => [],
    },
});

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
    description: [DescriptionSectionSchema],
});

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = {
    ProductSchema,
    ProductModel,
};
