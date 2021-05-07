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
    let new_releases = await lists.getNewReleases().getAll();
    let coming_soon = await lists.getComingSoon().getAll();
    let best_sellers = await lists.getBestSellers().getAll();
    let award_winner = await lists.getAwardWinners().getAll();

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
    let releases = null;//await lists.getNewReleases().getAll();
    if (list_id == 1) {
        releases = await lists.getNewReleases().getAll();
    } else if (list_id == 2) {
        releases = await lists.getComingSoon().getAll();
    } else if (list_id == 3) {
        releases = await lists.getBestSellers().getAll();
    } else if (list_id == 4) {
        releases = await lists.getAwardWinners().getAll();
    }
    releases = releases.map(val => val['book_id']);
    books_list = books_list.filter(val => !releases.includes(val['book_id']));
    render(req,res,'admin/list_add.twig', {list_id: list_id, books: books_list});
});

async function getList(req) {
    const list_id = req.params.list_id;
    if (list_id == 1) {
        return lists.getNewReleases();
    } else if (list_id == 2) {
        return lists.getComingSoon();
    } else if (list_id == 3) {
        return lists.getBestSellers();
    } else if (list_id == 4) {
        return lists.getAwardWinners();
    }
}

router.post('/:list_id/remove', async function (req, res, next) {
    let list = await getList(req);
    const book_id = req.body.book_id;

    await list.remove(book_id);

    res.redirect('/admin');
});
router.post('/:list_id/add', async function (req, res, next) {
    let list = await getList(req);
    const book_id = req.body.book_id;

    await list.add(book_id);

    res.redirect('/admin');
});

module.exports = router;