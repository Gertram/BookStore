var express = require('express');
var router = express.Router();
const books = require('../../models/books');
const genres = require('../../models/genres');
const authors = require('../../models/authors');
const render = require('../../app/render');

router.use(async function(req,res,next) {
    //Пользователь не администратор и не менеджер по продажам
    if(req.user.role != 3 && req.user.role != 1){
        res.status(403);
        return res.send();
    }
    next();
});

router.post('/add',async function(req,res,next) {
    await books.add(req.body.title,"",[],req.body.author);
    res.redirect('back');
});
router.get('/',async function(req,res,next) {
    let books_list = await books.getAll();
    let genres_list = await genres.getAll();
    let authors_list = await authors.getAll();
    render(req,res,'admin/books_panel',{
        genres: genres_list,
        authors: authors_list,
        books:books_list
    });
});

router.post('/remove',async function(req,res,next) {
    await books.remove(req.body.book);
    res.redirect('/back');
});

module.exports = router;