var express = require('express');
var router = express.Router();
const lists = require('../../models/lists');
const books = require('../../models/books');

router.get('/:list_id/add',async function(req,res,next) {
    let list_id = req.params.list_id;
    let books_list = await books.getAll();
    let releases = null;//await lists.getNewReleases().getAll();
    if(list_id == 1){
        releases = await lists.getNewReleases().getAll();
    } else if(list_id == 2){
        releases = await lists.getComingSoon().getAll();
    } else if(list_id == 3){
        releases = await lists.getBestSellers().getAll();
    } else if(list_id == 4){
        releases = await lists.getAwardWinners().getAll();
    }
    releases = releases.map(val => val['book_id']);
    books_list = books_list.filter(val => !releases.includes(val['book_id']));
    res.render('admin/list_add.twig',{list_id:list_id,books:books_list});
});

router.post('/',async function(req,res,next) {
    const list_id = req.body.list;
    const action = req.body.action;
    const book_id = req.body.book_id;
    let releases = null;
    if(list_id == 1){
        releases = await lists.getNewReleases();
    } else if(list_id == 2){
        releases = await lists.getComingSoon();
    } else if(list_id == 3){
        releases = await lists.getBestSellers();
    } else if(list_id == 4){
        releases = await lists.getAwardWinners();
    }
    if(action === 'remove'){
        await releases.remove(book_id);
    }else if(action === 'add'){
        await releases.add(book_id);
    }
    res.redirect('/admin');
});

module.exports = router;