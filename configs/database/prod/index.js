class NoPasswordError extends Error {}

module.exports = {
    get uri() {
        const {MONGO_PASSWORD} = process.env;
        if (!MONGO_PASSWORD) {
            throw new NoPasswordError('No mongo password!');
        }
        return (
            `mongodb+srv://wgwergwegwer:${process.env.MONGO_PASSWORD}` +
            '@geometric-0t3ep.mongodb.net/GeoMetric?retryWrites=true&w=majority'
        );
    },
    options: {useNewUrlParser: true},
};
