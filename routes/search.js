const express = require('express');
const router = express.Router();
const books = require('../models/books');
const render = require('../app/render');
/* GET home page. */
router.get('/', function(req, res, next) {
    render(req,res,"search/search", { title: 'Search' });
});

router.get('/query', async function(req, res, next) {
    let books_list = await books(req).search(req.query.query);
    return render(req,res,"search/search", { title: 'Search',results:books_list });
});

module.exports = router;
