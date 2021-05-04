var express = require('express');
var router = express.Router();
const render = require('../app/render');

/* GET home page. */
router.get('/', function(req, res, next) {
    render(req,res,"services/services", { title: 'Services' });
});

module.exports = router;
