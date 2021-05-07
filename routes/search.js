const express = require('express');
const router = express.Router();
const books = require('../models/books');
const render = require('../app/render');
/* GET home page. */
router.get('/', function(req, res, next) {
    render(req,res,"search/search", { title: 'Search' });
});

router.get('/query', async function(req, res, next) {
    let books_list = await books.search(req.query.query);
    render(req,res,"search/results", { title: 'Search',results:books_list });
});

module.exports = router;
