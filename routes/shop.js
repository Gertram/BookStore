var express = require('express');
var router = express.Router();
const render = require('../app/render');
const books = require('../models/books');
const genres = require('../models/genres');
const tags = require('../models/tags');
const getBasket = require('../models/basket');
/* GET home page. */
router.get('/', async function(req, res, next) {
  let min_price = req.query.min_price;
  let max_price = req.query.max_price;
  let range = (await books.getRange())[0];
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
  
  let books_list = await books.getAll(filters);

  let genres_list = await genres.getAll();

  let tags_list = await tags.getAll();

  let basket = getBasket(req,res);

  render(req,res,"shop/shop", { title: 'Express',books:books_list,range:range,genres:genres_list,tags:tags_list,basket:await basket.products() });
});

router.get('/:book_id/',async function(req,res,next) {
  let book = await books.get(req.params.book_id);
  if(book.length === 0){
    res.status(404);
    return;
  }
  let books_list = await books.getAll();

  render(res,req,'shop/book/book',{books:books_list,book:book[0]});
});

module.exports = router;
