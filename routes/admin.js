var express = require('express');
var router = express.Router();
var lists = require('../models/lists');
const books = require('../models/books');
const genres = require('../models/genres');
const authors = require('../models/authors');

/* GET home page. */
router.get('/', async function (req, res, next) {
    let new_releases = await lists.getNewReleases().getAll();
    let coming_soon = await lists.getComingSoon().getAll();
    let best_sellers = await lists.getBestSellers().getAll();
    let award_winner = await lists.getAwardWinners().getAll();
    let genres_list = await genres.getAll();
    let authors_list = await authors.getAll();
    let books_list = await books.getAll();

    res.render("admin/admin", {
        title: 'Admin', lists: {
            new_releases: new_releases,
            coming_soon: coming_soon,
            best_sellers: best_sellers,
            award_winner: award_winner
        },
        genres: genres_list, authors: authors_list,
        books:books_list
    });
});

router.use('/lists', require('./admin/lists'))

router.use('/books', require('./admin/books'));

router.use('/genres', require('./admin/genres'));

router.use('/authors', require('./admin/authors'));

module.exports = router;
