const {pick} = require('ramda');

const getCategoryPreview = categoryDoc => pick(['name', 'image', 'id'], categoryDoc);

module.exports = {
    getCategoryPreview,
};
