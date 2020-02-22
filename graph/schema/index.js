const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLString,
    GraphQLInt,
} = require('graphql');

const template = require('./../../template');
const colors = require('./../../colors');

const {
    ColorSectionType,
} = require('./colors');

const {
    ProductCategoryType,
    ProductType,
} = require('./product');

const RootType = new GraphQLObjectType({
    name: 'root',
    fields: {
        colorSections: {
            type: GraphQLList(ColorSectionType),
            resolve: () => {
                return colors;
            },
        },
        product: {
            type: ProductType,
            args: {
                categoryId: {type: GraphQLInt},
                productId: {type: GraphQLString},
            },
            resolve: (_, args) => {
                const {productId, categoryId} = args;

                const category = template.productCategories.find(
                    ({id}) => id === categoryId,
                );
                if (!category) return null;

                const product = category.items.find(
                    ({id}) => id === productId,
                );
                if (product) return product;

                return null;
            },
        },
        products: {
            type: GraphQLList(ProductType),
            args: {
                categoryId: {type: GraphQLInt},
            },
            resolve: (_, args) => {
                const {categoryId} = args;
                const category = template.productCategories.find(
                    ({id}) => id === categoryId,
                );

                if (category) return category.items;
                return null;
            },
        },
        productCategories: {
            type: GraphQLList(ProductCategoryType),
            resolve() {
                return template.productCategories;
            },
        },
    },
});

const RootSchema = new GraphQLSchema({
    query: RootType,
});

module.exports = {
    RootSchema,
};
