const router = require('express').Router();

const authRoutes = require('./auth');
const categoriesRoutes = require('./categories');

router.use('/auth', authRoutes);
router.use('/categories', categoriesRoutes);

module.exports = router;
