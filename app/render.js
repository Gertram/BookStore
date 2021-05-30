const users = require('../models/users');
const books = require('../models/books');
const basket = require('../models/basket');

function render(req, res, template, items = {}) {
    basket(req, res).products().then(produts => {
        const count = produts.length;
        items.basket_count = count;
        books(req).getMostPopular(3).then(mostPopular => {
            items.fbest_sellers = mostPopular;
            items['huser'] = req.user;
            return res.render(template, items);
        });
    });
}

module.exports = render;