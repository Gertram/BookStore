var express = require('express');
var router = express.Router();
var lists = require('../models/lists');
var genres = require('../models/genres');
var books = require('../models/books');
var authors = require('../models/authors');
var featured_bestsellers = require('../models/featured_bestsellers');
const render = require('../app/render');
/* GET home page. */
router.get('/', async function (req, res, next) {

    let mlists = await lists.Lists(req).getAll()
    let genres_list = await genres(req).getMostNumerous(4);
    let picked = await books(req).getMostPopular(4);
    let mostPopular = await authors(req).getMostPopular(4);
    let featured_bestsellers_list = await featured_bestsellers(req).getRandom();
    let new_list = await books(req).getNew(4);

    console.log(featured_bestsellers_list);

    return render(req, res, "index/index", {
        title: 'BookStore',
        lists: mlists,
        genres: genres_list,
        picked: picked,
        most_popular: mostPopular,
        featured_bestsellers: {best: featured_bestsellers_list, news: new_list}
    });
});

module.exports = router;
