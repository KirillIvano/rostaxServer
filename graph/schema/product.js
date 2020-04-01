const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
} = require('graphql');

const DescriptionItemType = new GraphQLObjectType({
    name: 'descriptionItem',
    fields: {
        name: {type: GraphQLString},
        value: {type: GraphQLString},
    },
});

const DescriptionSectionType = new GraphQLObjectType({
    name: 'descriptionSection',
    fields: {
        name: {type: GraphQLString},
        items: {type: GraphQLList(DescriptionItemType)},
    },
});

const ProductType = new GraphQLObjectType({
    name: 'product',
    fields: {
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        shortDescription: {type: GraphQLString},
        type: {type: GraphQLString},
        price: {type: GraphQLString},
        image: {type: GraphQLString},
        certificate: {type: GraphQLString},
        description: {type: GraphQLList(DescriptionSectionType)},
    },
});

const ProductCategoryType = new GraphQLObjectType({
    name: 'productCategory',
    fields: {
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        image: {type: GraphQLString},
    },
});

module.exports = {
    ProductCategoryType,
    ProductType,
};
