const users = require('../models/users');
const books = require('../models/books');
const basket = require('../models/basket');

function render(req,res,template,items = {}) {
    basket(req,res).products().then(produts => {
        const count = produts.length;
        items.basket_count = count;
        books.getMostPopular(3).then(mostPopular => {
            items.fbest_sellers = mostPopular;
            if (req.cookies.user != null) {
                return users.get(req.cookies.user).then(data => {
                    items['huser'] = data[0];
                    res.render(template, items);
                });
            }
            res.render(template, items)
        });
    });
}

module.exports = render;