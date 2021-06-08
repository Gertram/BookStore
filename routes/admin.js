const express = require('express');
const router = express.Router();
const adminController = require('../controllers/Admin/AdminController');

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
router.get('/', adminController.index);

router.use('/lists', require('./admin/lists'));

router.use('/books', require('./admin/books'));

router.use('/genres', require('./admin/genres'));

router.use('/tags', require('./admin/tags'));

router.use('/authors', require('./admin/authors'));

router.use('/providers', require('./admin/providers'));

router.use('/deliveries', require('./admin/deliveries'));

router.use('/reviews', require('./admin/reviews'));

router.use('/orders', require('./admin/orders'));

router.use('/users', require('./admin/users'));

router.use('/contacts', require('./admin/contacts'));

router.use('/emails', require('./admin/emails'));

router.use('/featured_bestsellers', require('./admin/featured_bestsellers'));

module.exports = router;
