const express = require('express');

const router = express.Router();

router.use('/health', require('./health'));
router.use('/proteins', require('./proteins'));
router.use('/variations', require('./variations'));
router.use('/domains', require('./domains'));
router.use('/exons', require('./exons'));


// router.use('/locations', require('./locations'));
// router.use('/historic', require('./historic'));

module.exports = router;
