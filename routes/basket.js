const express = require('express');
const router = express.Router();
const basketController = require('../controllers/BasketController');


router.get('/', basketController.index);

router.post('/buy',basketController.buy);

router.post('/add', basketController.add);

router.post("/remove",basketController.remove);

router.post("/clear",basketController.clear);

module.exports = router;
