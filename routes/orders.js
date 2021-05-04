var express = require('express');
var router = express.Router();
const orders = require('../models/orders')
const render = require('../app/render');

/* GET home page. */
router.get('/:order', async function(req, res, next) {
    let order = await orders.get(req.params.order);
    console.log(order);
    render(req,res,"orders/order", order);
});

module.exports = router;
