var express = require('express');
var router = express.Router();
var lists = require('../models/lists');
var genres = require('../models/genres');
const render = require('../app/render');
/* GET home page. */
router.get('/', async function(req, res, next) {
  let new_releases = await lists.getNewReleases().getAll();
  let genres_list = await genres.getAll();
  render(req,res,"index/index", { title: 'BookStore',new_releases:new_releases,genres:genres_list});
});

module.exports = router;
