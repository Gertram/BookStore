const express = require('express');
const router = express.Router();
const emailsController = require('../controllers/EmailsController');

router.post('/add', emailsController.add);

module.exports = router;
