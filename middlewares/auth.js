const passport = require('passport');
const {jsonResponse} = require('~/helpers/jres');

const auth = (strategy, options) =>
    (req, res, next) =>
        passport.authenticate(
            strategy,
            options,
            (err, user) => {
                if (err) {
                    jsonResponse(res, 401, {error: err});
                    return;
                }
                if (!user) {
                    jsonResponse(res, 401, {error: 'You are not authenticated'});
                    return;
                }

                req.user = user;
                next();
            },
        )(req, res, next);


module.exports = {auth};
