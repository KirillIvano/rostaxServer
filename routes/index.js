const router = require('express').Router();

const adminRoutes = require('./admin');
const botRoutes = require('./bot');

router.use('/admin', adminRoutes);
router.use('/bot', botRoutes);

module.exports = router;
