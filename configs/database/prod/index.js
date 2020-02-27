class NoPasswordError extends Error {}

module.exports = {
    get uri() {
        const {MONGO_PASSWORD} = process.env;
        if (!MONGO_PASSWORD) {
            throw new NoPasswordError('No mongo password!');
        }
        return (
            `@mongodb://wgwergwegwer:${process.env.MONGO_PASSWORD}` +
            '@ds117749.mlab.com:17749/heroku_5sc3dw05'
        );
    },
    options: {useNewUrlParser: true},
};
