const {CategoryModel} = require('~/database/schemas/category');

const createCategory = (name, image) => CategoryModel.create({name, image});

const getAllCategories = () => CategoryModel.find();
const getCategoryById = _id => CategoryModel.findById({_id});

const updateCategory = (name, image) => CategoryModel.update({$set: {name, image}});

const deleteCategory = _id => CategoryModel.deleteOne({_id});

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    deleteCategory,
    updateCategory,
};
