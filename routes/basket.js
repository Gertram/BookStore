var express = require('express');
var router = express.Router();
const users = require('../models/users')

/* GET home page. */
router.get('/', async function(req, res, next) {
    let basket = req.cookies == null?null:req.cookies.basket;
    console.log(basket);
    res.render("basket/basket", { title: 'Basket',basket:basket});
});
/* GET home page. */
router.post('/add', function(req, res, next) {
    let product = req.body.product;
    let quantity = req.body.quantity;
    let price = req.body.price;

    if(req.cookies == null){
        res.cookie('basket',[{product:product,quantity:quantity,price:price},{maxAge: 90000000, httpOnly: true, secure: false, overwrite: true}]);
        res.redirect('back');
        return;
    }

    let basket = req.cookies['basket'];

    console.log(basket);

    res.cookie('basket',basket,{maxAge: 90000000, httpOnly: true, secure: false, overwrite: true})

    res.redirect('back');
});

module.exports = router;
