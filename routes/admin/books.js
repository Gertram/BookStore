const express = require('express');
const router = express.Router();
const books = require('../../models/books');
const genres = require('../../models/genres');
const authors = require('../../models/authors');
const render = require('../../app/render');
const fs = require('fs');

router.use(async function(req,res,next) {
    //Пользователь не администратор и не менеджер по продажам
    if(req.user.role != 3 && req.user.role != 1){
        res.status(403);
        return res.send();
    }
    next();
});

router.get('/add',async function(req,res,next) {
    let genres_list = await genres.getAll();
    let authors_list = await authors.getAll();



    res.render('admin/books/book_add',{authors:authors_list,genres:genres_list});
});

router.post('/add',async function(req,res,next) {
    let filedata = req.file;
    if(filedata === undefined){
        return res.redirect('back');
    }
    const genres = Array.isArray(req.body.genres)?req.body.genres:[req.body.genres];
    const authors = Array.isArray(req.body.authors)?req.body.authors:[req.body.authors];
    const items = filedata.originalname.split('.');
    const filename = filedata.filename + '.' + items[items.length - 1];
    console.log(filename);
    fs.rename(filedata.path,'public/img/' + filename,function(err){
        books.add(req.body.title,req.body.description,0,filename,genres,authors).then(book => {
            res.redirect('/admin/books/' + book._id);
        });
    });
});

router.get('/',async function(req,res,next) {
    const query = req.query.query;

    let books_list = await (query == null?books.getAll():books.search(query));

    render(req,res,'admin/books/books',{
        books:books_list
    });
});

router.post('/:book_id/redact',async function(req,res,next) {

    let book = await books.getShort(req.params.book_id);
    if(book == null){
        res.status(404);
        return res.send();
    }
    let filedata = req.file;

    let authors = req.body.authors;
    let genres = req.body.genres;
    const price = Math.round(100 *parseFloat(req.body.price));

    const description = req.body.description;
    const title = req.body.title;

    if(filedata !== undefined){
        const items = filedata.originalname.split('\\')
        const filename = filedata.filename + '.' + items[items.length - 1]
        fs.rename(filedata.path,'public/img/' + filename,function(err){
            console.log(err);
            books.redact(req.params.book_id, title,price,description,filename,genres,authors).then(val =>{
                res.redirect('back');
            });
        });
    }else {
        await books.redact(req.params.book_id, title,price,description,null,genres,authors);
        res.redirect('back');
    }
});


router.post('/:book_id/remove',async function(req,res,next) {
    await books.remove(req.params.book_id);
    res.redirect('/admin/books');
});

router.get('/:book_id',async function(req,res,next) {

    let book = await books.get(req.params.book_id);

    if(book == null){
        res.status(404);
        return res.send();
    }

    book.authors = book.authors.map(val => val.author_id);
    book.genres = book.genres.map(val => val.genre_id);

    let genres_list = await genres.getAll();
    let authors_list = await authors.getAll();

    render(req,res,'admin/books/book',{
        book:book,
        authors_list:authors_list,
        genres_list:genres_list
    });
});


module.exports = router;