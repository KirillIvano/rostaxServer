const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
} = require('graphql');

const ColorType = new GraphQLObjectType({
    name: 'color',
    fields: () => ({
        code: {type: GraphQLString},
        name: {type: GraphQLString},
    }),
});

const ColorSectionType = new GraphQLObjectType({
    name: 'colorSection',
    fields: () => ({
        name: {type: GraphQLString},
        colors: {type: GraphQLList(ColorType)},
    }),
});

module.exports = {
    ColorSectionType,
};
