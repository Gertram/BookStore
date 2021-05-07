var express = require('express');
var router = express.Router();
const orders = require('../models/orders')
const render = require('../app/render');
/* GET home page. */
router.get('/', async function(req, res, next) {
    if(req.cookies.user == null){
        if(req.cookies.orders == null || req.cookies.orders.length == 0){
            return render(req,res,'orders/orders',{orders:[]})
        }

        let orders_List = await orders_list.getAll(req.cookies.orders);
        return render(req,res,"orders/orders", {orders:orders_list});
    }

    let orders_list = await orders.getAll(req.cookies.user);
    console.log(orders_list);
    render(req,res,"orders/orders", {orders:orders_list});
});
/* GET home page. */
router.get('/find', async function(req, res, next) {
    let order_id = req.query.order_id;
    let order = await orders.get(order_id);
    console.log(order_id);
    console.log(order);
    render(req,res,"orders/order", {order:order});
});
/* GET home page. */
router.get('/:order', async function(req, res, next) {
    let order = await orders.get(req.params.order);
    console.log(order);
    render(req,res,"orders/order", {order:order});
});

module.exports = router;
