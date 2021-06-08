const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/OrdersController');

/* GET home page. */
router.get('/', ordersController.index);
/* GET home page. */
router.get('/find', ordersController.find);
/* GET home page. */
router.get('/:order', ordersController.order);

module.exports = router;
