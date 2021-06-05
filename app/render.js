const users = require('../models/users');
const books = require('../models/books');
const basket = require('../models/basket');
const bookmarks = require('../models/bookmarks');

async function render(req, res, template, items = {}) {
    items.basket = await basket(req, res).products();
    const mostPopular = await books(req).getMostPopular(3);
    items.fbest_sellers = mostPopular;
    items['huser'] = req.user;
    items.bookmarks = (await bookmarks(req,res).products()).map(item => item._id.toString());

    return res.render(template,items);
}

module.exports = render;