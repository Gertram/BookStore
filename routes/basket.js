var express = require('express');
var router = express.Router();
const users = require('../models/users');
const books = require('../models/books');
const orders = require('../models/orders');
const user_basket = require('../models/user_basket');

class CookieBasket{
    constructor(req,res){
        this.res = res;
        this.req = req;
    }
    async products(){
        let products = this.req.cookies.basket;
        if(products == null){
            return [];
        }
        let books_list = await books.getFilter(products.map(val => val.product));
        return books_list.map(book => {
            book.quantity = products.filter(item => item.product == book.book_id)[0].quantity;
            return book;
        });
    }
    async add(product,quantity){
        let basket = this.req.cookies.basket;
        if(basket == null){
            basket = [];
        }

        basket.push({product: product, quantity: quantity});

        this.res.cookie('basket', basket, {maxAge: 90000000, httpOnly: true, secure: false, overwrite: true});
    }
    async remove(product){
        let basket = this.req.cookies.basket;
        basket = basket.filter(item => {
            return item.product != product;
        });

        this.res.cookie('basket', basket, {maxAge: 90000000, httpOnly: true, secure: false, overwrite: true});
    }
}

function getBasket(req,res){
    if(req.cookies.user == null) {
        return new CookieBasket(req, res)
    }
    return new user_basket(req.cookies.user);
}

/* GET home page. */
router.get('/', async function (req, res, next) {
    let products = await getBasket(req,res).products();
    res.render("basket/basket", {title: 'Basket', basket: products});
});

router.post('/buy',async function (req,res,next) {
    let step = req.body.step;
    if(step == null){
        res.render('basket/order/order_address');
    } else if(step === "address"){
        res.render('basket/order/order_payment',{address:req.body.address});
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
