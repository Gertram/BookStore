const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/ContactsController');

router.get('/', contactsController.index);

router.post('/contact', contactsController.contact);

module.exports = router;
