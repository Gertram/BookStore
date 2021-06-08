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

    console.log(products);

    return render(req,res,"basket/basket", {title: 'Basket', basket: products});
});

router.post('/buy',async function (req,res,next) {
    let step = req.body.step;
    if(step == null){
        return render(req,res,'basket/order/order_address');
    } else if(step === "address"){
        return render(req,res,'basket/order/order_payment',{
            surname:req.body.surname,
            name:req.body.name,
            middlename:req.body.middlename,
            phone:req.body.phone,
            address:req.body.address});
    } else if(step === "payment"){
        let basket = getBasket(req,res);
        let order = await orders(req).add(await basket.products(),
            req.body.surname,
            req.body.name,
            req.body.middlename,
            req.body.phone,
            req.body.address,
            req.body.card_number,
            req.body.card_validity,
            req.body.card_owner,
            req.body.card_code,
            req.user == null?1:req.user._id
        );

        basket.clear();
        res.redirect('/orders/' + order._id)
    }
});

/* GET home page. */
router.post('/add', async function (req, res, next) {
    console.log(req);
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
router.post("/clear",async function (req,res,next) {
    let product = req.body.product;
    await getBasket(req,res).clear();

    res.redirect('back');
});

module.exports = router;
