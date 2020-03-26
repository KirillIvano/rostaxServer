const {pick} = require('ramda');

const getClientProduct = categoryDoc => pick(
    [
        'name',
        'shortDescription',
        'description',
        'id',
    ],
    categoryDoc,
);

module.exports = {
    getClientProduct,
};
