const {pick} = require('ramda');

const productFields = [
    'name',
    'shortDescription',
    'description',
    'id',
];

const getClientProduct = categoryDoc => pick(
    productFields,
    categoryDoc,
);

module.exports = {
    getClientProduct,
};
