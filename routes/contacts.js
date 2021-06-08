var express = require('express');
var router = express.Router();
const render = require('../app/render');
const contacts = require('../models/contacts');

/* GET home page. */
router.get('/', async function(req, res, next) {
    return render(req,res,"contacts/contacts", { nav: 'contacts' });
});

router.post('/contact', async function(req, res, next) {
    await contacts(req).add(req.body.name,req.body.email,req.body.question,req.body.message);
    return render(req,res,'contacts/answer');
});

module.exports = router;
