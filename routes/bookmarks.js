var express = require('express');
var router = express.Router();
const users = require('../models/users');
const books = require('../models/books');
const orders = require('../models/orders');
const bookmarks = require('../models/bookmarks');
const render = require('../app/render');

/* GET home page. */
router.get('/', async function (req, res, next) {
    let products = await bookmarks(req,res).products();

    console.log(products);

    return render(req,res,"bookmarks/bookmarks", { mbookmarks: products});
});
/* GET home page. */
router.post('/add', async function (req, res, next) {
    let product = req.body.book_id;;

    await bookmarks(req,res).add(product);

    res.redirect('back');
});

router.post("/remove",async function (req,res,next) {
    let product = req.body.book_id;
    await bookmarks(req,res).remove(product);

    res.redirect('back');
});

module.exports = router;
