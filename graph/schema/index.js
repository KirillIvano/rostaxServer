const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLString,
} = require('graphql');

const {getAllCategories} = require('~/database/interactions/category');
const {getProductByIds, getProductsByCategoryId} = require('~/database/interactions/products');

const {
    ProductCategoryType,
    ProductType,
} = require('./product');

const RootType = new GraphQLObjectType({
    name: 'root',
    fields: {
        product: {
            type: ProductType,
            args: {
                categoryId: {type: GraphQLString},
                productId: {type: GraphQLString},
            },
            resolve: (_, args) => {
                const {productId, categoryId} = args;

                return getProductByIds(categoryId, productId);
            },
        },
        products: {
            type: GraphQLList(ProductType),
            args: {
                categoryId: {type: GraphQLString},
            },
            resolve: (_, args) => {
                const {categoryId} = args;

                return getProductsByCategoryId(categoryId);
            },
        },
        productCategories: {
            type: GraphQLList(ProductCategoryType),
            resolve: async () => await getAllCategories(),
        },
    },
});

const RootSchema = new GraphQLSchema({
    query: RootType,
});

module.exports = {
    RootSchema,
};
