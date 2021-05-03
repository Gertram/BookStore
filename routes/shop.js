var express = require('express');
var router = express.Router();
const books = require('../models/books');
/* GET home page. */
router.get('/', async function(req, res, next) {
  let books_list = await books.getAll();
  res.render("shop/shop", { title: 'Express',books:books_list });
});

router.get('/:book_id/',async function(req,res,next) {
  let books_list = await books.getAll();
  let book = books_list.filter(val => val['book_id'] == req.params.book_id)
  res.render('shop/book/book',{books:books_list});
});

module.exports = router;
