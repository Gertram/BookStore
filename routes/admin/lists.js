var express = require('express');
var router = express.Router();
const lists = require('../../models/lists');
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
    let new_releases = await lists.Lists.getNewReleases().getAll();
    let coming_soon = await lists.Lists.getComingSoon().getAll();
    let best_sellers = await lists.Lists.getBestSellers().getAll();
    let award_winner = await lists.Lists.getAwardWinners().getAll();

    render(req,res,'admin/lists', {
        new_releases: new_releases,
        coming_soon: coming_soon,
        best_sellers: best_sellers,
        award_winner: award_winner
    })
});

router.get('/:list_id/add', async function (req, res, next) {
    let list_id = req.params.list_id;
    let books_list = await books.getAll();

    let releases = await (new lists.List(list_id)).getAll();

    releases = releases.map(val => val['_id'].toString());

    books_list = books_list.filter(val => !releases.includes(val['_id'].toString()));
    render(req,res,'admin/list_add.twig', {list_id: list_id, books: books_list});
});

router.post('/:list_id/remove', async function (req, res, next) {
    let list = new lists.List(req.params.list_id);
    const book_id = req.body.book_id;

    await list.remove(book_id);

    res.redirect('back');
});
router.post('/:list_id/add', async function (req, res, next) {
    let list = new lists.List(req.params.list_id);
    const book_id = req.body.book_id;

    await list.add(book_id);

    res.redirect('/admin/lists');
});

module.exports = router;