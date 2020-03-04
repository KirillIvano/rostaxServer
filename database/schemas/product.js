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

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    shortDescription: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    description: [DescriptionItemSchema],
});

module.exports = {
    ProductSchema,
};
