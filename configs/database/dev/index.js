class NoPasswordError extends Error {}

module.exports = {
    get uri() {
        const {MONGO_PASSWORD} = process.env;

        if (!MONGO_PASSWORD) {
            throw new NoPasswordError('No mongo password!');
        }
        return (
            'mongodb://localhost:27017/rostax'
        );
    },
    options: {useNewUrlParser: true},
};
