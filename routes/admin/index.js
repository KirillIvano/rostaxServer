const router = require('express').Router();

const authRoutes = require('./auth');
const categoriesRoutes = require('./categories');

const {auth} = require('~/middlewares/auth');

router.use('/auth', authRoutes);
router.use('/categories', auth('bearer', {session: false}), categoriesRoutes);

module.exports = router;
