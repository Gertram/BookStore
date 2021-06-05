var express = require('express');
var router = express.Router();
const render = require('../app/render');
const emails = require('../models/emails');

router.post('/add', async function(req, res, next) {
    await emails(req).add(req.body.email);
    return render(req,res,'contacts/answer');
});

module.exports = router;
