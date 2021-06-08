const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/AboutController');

/* GET home page. */
router.get('/', aboutController.index);

module.exports = router;
