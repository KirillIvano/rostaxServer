const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLID,
} = require('graphql');

const DescriptionItemType = new GraphQLObjectType({
    name: 'descriptionItem',
    fields: {
        propName: {type: GraphQLString},
        propValue: {type: GraphQLString},
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
        id: {type: GraphQLID},
        certificate: {type: GraphQLString},
        name: {type: GraphQLString},
        shortDescription: {type: GraphQLString},
        type: {type: GraphQLString},
        description: {type: GraphQLList(DescriptionSectionType)},
    },
});

const ProductCategoryType = new GraphQLObjectType({
    name: 'productCategory',
    fields: {
        id: {type: GraphQLID},
        name: {type: GraphQLString},
    },
});

module.exports = {
    ProductCategoryType,
    ProductType,
};
