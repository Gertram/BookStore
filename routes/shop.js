var express = require('express');
var router = express.Router();
const render = require('../app/render');
const books = require('../models/books');
const genres = require('../models/genres');
const tags = require('../models/tags');
const getBasket = require('../models/basket');
const reviews = require('../models/reviews');
/* GET home page. */
router.get('/', async function(req, res, next) {
  let min_price = req.query.min_price;
  let max_price = req.query.max_price;
  let range = (await books(req).getRange());
  let filters = {};
  if(min_price == null){
      min_price = range.min_price;
  }else{
    const buff = min_price.split('.');
    min_price = buff[0] * 100 + (buff[1] != undefined?parseInt(buff[1]):0);
    range.min_price = min_price;
    filters.min_price = min_price
  }
  if(max_price == null){
    max_price = range.max_price;
  }else{
    const buff = max_price.split('.');
    max_price = buff[0] * 100 + (buff[1] != undefined?parseInt(buff[1]):0);
    range.max_price = max_price;
    filters.max_price = max_price
  }

  let sgenres = req.query.genres;

  if(sgenres != null){
    filters.genres = Array.isArray(sgenres)?sgenres:[sgenres];
  }
  let stags = req.query.tags;

  if(stags != null){
      filters.tags = Array.isArray(stags)?stags:[stags];
  }
  
  let books_list = await books(req).getAll(filters);

  let genres_list = await genres(req).getAll();

  let tags_list = await tags(req).getAll();

  let basket = getBasket(req,res);

  render(req,res,"shop/shop", { title: 'Express',books:books_list,range:range,genres:genres_list,tags:tags_list,basket:await basket.products() });
});

router.post('/:book_id/add_review',async function(req,res,next) {
  let book = await books.get(req.params.book_id);
  if(book.length === 0){
    res.status(404);
    return;
  }
  await reviews.add(req.user.user_id,req.params.book_id,req.body.raiting,req.body.comment);

  res.redirect('back');
});

router.get('/:book_id/',async function(req,res,next) {

  let book = await books.get(req.params.book_id);
  if(book.length === 0){
    res.status(404);
    return;
  }
  await books.addView(req.params.book_id);

  let books_list = await books.getAll();

  let reviews_list = await reviews.getAllForBook(req.params.book_id), is_comment;

  is_comment = false;

  reviews_list.forEach(item => {
      if(req.user != null && item.user_id == req.user.user_id){
          is_comment = true;
      }
  });

  render(req,res,'shop/book/book',{books:books_list,book:book[0],reviews:reviews_list,is_comment:is_comment});
});

module.exports = router;
