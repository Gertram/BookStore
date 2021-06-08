const express = require('express');
const router = express.Router();
const searchController = require('../controllers/SearchController');

router.get('/', searchController.index);

router.get('/query', searchController.query);

module.exports = router;
