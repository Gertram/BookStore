var express = require('express');
var router = express.Router();
const orders = require('../models/orders')

/* GET home page. */
router.get('/:order', async function(req, res, next) {
    let order = await orders.get(req.params.order);
    console.log(order);
    res.render("orders/order", order);
});

module.exports = router;
