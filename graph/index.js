const {RootSchema} = require('./schema');
const gqlHttp = require('express-graphql');

const initializeGraphql = () => gqlHttp({
    schema: RootSchema,
    graphiql: true,
});

module.exports = {
    initializeGraphql,
};
