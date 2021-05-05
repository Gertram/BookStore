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

    let mbooks = {
        new_releases: await lists.getNewReleases().getAll(),
        coming_soon: await lists.getComingSoon().getAll(),
        best_sellers: await lists.getBestSellers().getAll(),
        award_winners: await lists.getAwardWinners().getAll()
    };

    let genres_list = await genres.getMostNumerous(4);
    let picked = await books.getMostPopular(4);
    let mostPopular = await authors.getMostPopular(4);
    let featured_bestsellers_list = await featured_bestsellers.getRandom();
    let new_list = await books.getNew(4);
    render(req, res, "index/index", {
        title: 'BookStore',
        lists: mbooks,
        genres: genres_list,
        picked: picked,
        most_popular: mostPopular,
        featured_bestsellers: {best: featured_bestsellers_list[0], news: new_list}
    });
});

module.exports = router;
