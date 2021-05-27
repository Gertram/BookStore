var express = require('express');
var router = express.Router();
var lists = require('../models/lists');
const books = require('../models/books');
const genres = require('../models/genres');
const authors = require('../models/authors');
const users = require('../models/users');

const render = require('../app/render');

router.use(async function (req,res,next) {
    if(req.user == null){
        return res.redirect('/login');
    }
    if(req.user.role == 5){
        res.status(403);
        return res.send();
    }
    next();
});

/* GET home page. */
router.get('/', async function (req, res, next) {
    render(req,res,"admin/admin");
});

router.use('/lists', require('./admin/lists'))

router.use('/books', require('./admin/books'));

router.use('/genres', require('./admin/genres'));

router.use('/tags', require('./admin/tags'));

router.use('/authors', require('./admin/authors'));

router.use('/providers', require('./admin/providers'));

router.use('/deliveries', require('./admin/deliveries'));

router.use('/reviews', require('./admin/reviews'));

router.use('/users', require('./admin/users'));

router.use('/featured_bestsellers', require('./admin/featured_bestsellers'));

module.exports = router;
