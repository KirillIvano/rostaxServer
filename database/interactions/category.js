const {CategoryModel} = require('~/database/schemas/category');

const createCategory = (name, image) => CategoryModel.create({name, image});

const getAllCategories = () => CategoryModel.find();
const getCategoryById = _id => CategoryModel.findById({_id});

const updateCategory = async (id, updates) => {
    const {image, name} = updates;
    const updatedDoc = await CategoryModel.update({$set: {name, image}});

    return updatedDoc;
};

const deleteCategory = _id => CategoryModel.deleteOne({_id});

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    deleteCategory,
    updateCategory,
};
