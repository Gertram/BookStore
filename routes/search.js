const express = require('express');
const router = express.Router();
const books = require('../models/books');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render("search/search", { title: 'Search' });
});

router.get('/query', async function(req, res, next) {
    let books_list = await books.getAll();
    res.render("search/results", { title: 'Search',results:books_list });
});

module.exports = router;
