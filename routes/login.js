const express = require('express');
const router = express.Router();
const loginController = require('../controllers/LoginController');

router.get('/', loginController.index);

router.get('/logout',loginController.logout);

router.post('/', loginController.login);

module.exports = router;
