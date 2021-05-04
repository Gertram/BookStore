var express = require('express');
var router = express.Router();
const users = require('../models/users');
const books = require('../models/books');
const orders = require('../models/orders');
const getBasket = require('../models/basket');
const render = require('../app/render');

/* GET home page. */
router.get('/', async function (req, res, next) {
    let products = await getBasket(req,res).products();
    render(req,res,"basket/basket", {title: 'Basket', basket: products});
});

router.post('/buy',async function (req,res,next) {
    let step = req.body.step;
    if(step == null){
        render(req,res,'basket/order/order_address');
    } else if(step === "address"){
        render(req,res,'basket/order/order_payment',{address:req.body.address});
    } else if(step === "payment"){
        let basket = req.cookies.basket;
        let books_list = await books.getFilter(basket.map(val => val.product));
        books_list = books_list.map(book => {
            book.quantity = basket.filter(item => item.product == book.book_id)[0].quantity;
            return book;
        });
        let order = await orders.add(books_list,req.body.address,1);
        res.redirect('/orders/' + order)
    }
});

/* GET home page. */
router.post('/add', async function (req, res, next) {
    let product = req.body.product;
    let quantity = req.body.quantity;

    await getBasket(req,res).add(product,quantity);

    res.redirect('back');
});

router.post("/remove",async function (req,res,next) {
    let product = req.body.product;
    await getBasket(req,res).remove(product);

    res.redirect('back');
});

module.exports = router;
