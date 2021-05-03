var express = require('express');
var router = express.Router();
var lists = require('../models/lists');
var genres = require('../models/genres');
/* GET home page. */
router.get('/', async function(req, res, next) {
  let new_releases = await lists.getNewReleases().getAll();
  let genres_list = await genres.getAll();
  res.render("index/index", { title: 'BookStore',new_releases:new_releases,genres:genres_list});
});

module.exports = router;
