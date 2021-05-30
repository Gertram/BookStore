var express = require('express');
var router = express.Router();
const featured_bestsellers = require('../../models/featured_bestsellers');
const books = require('../../models/books');
const render = require('../../app/render');

router.use(async function(req,res,next) {
    //Пользователь не администратор и не менеджер по продажам
    if(req.user.role != 3 && req.user.role != 1){
        res.status(403);
        return res.send();
    }
    next();
});

router.get('/', async function (req, res, next) {
    const list = await featured_bestsellers(req).getAll();
    render(req,res,'admin/featured_bestsellers/index', {
        books:list
    })
});

router.get('/add', async function (req, res, next) {

    render(req,res,'admin/featured_bestsellers/add',{
        books:await books(req).getAll()
    });
});

router.post('/remove', async function (req, res, next) {
    await featured_bestsellers(req).remove(req.body.book_id);

    res.redirect('/admin/featured_bestsellers');
});
router.post('/add', async function (req, res, next) {
    await featured_bestsellers(req).add(req.body.book_id);

    res.redirect('/admin/featured_bestsellers');
});

module.exports = router;