const express = require('express');
const router = express.Router();
const shopController = require('../controllers/ShopController');

router.get('/', shopController.index);

router.post('/:book_id/add_review',shopController.addReview);

router.get('/:book_id/',shopController.book);

module.exports = router;
