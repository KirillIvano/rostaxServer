const {CategoryModel} = require('~/database/schemas/category');

const createCategory = name => CategoryModel.create({name});

const getAllCategoriesPreviews = () => CategoryModel.find({}, 'name image');
const getCategoryById = _id => CategoryModel.findById({_id});

const updateCategory = name => CategoryModel.update({$set: {name: name}});

const deleteCategory = _id => CategoryModel.deleteOne({_id});

module.exports = {
    getAllCategoriesPreviews,
    getCategoryById,
    createCategory,
    deleteCategory,
    updateCategory,
};
