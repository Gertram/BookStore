const express = require('express');
const router = express.Router();
const books = require('../../models/books');
const genres = require('../../models/genres');
const tags = require('../../models/tags');
const authors = require('../../models/authors');
const lists = require('../../models/lists');
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
    let genres_list = await genres(req).getAll();
    let authors_list = await authors(req).getAll();

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
    const price = Math.round(100 *parseFloat(req.body.price));
    fs.rename(filedata.path,'public/img/' + filename,function(err){
        books(req).add(req.body.title.trim(),req.body.description.trim(),price,req.body.isbn,filename,genres,authors).then(book => {
            res.redirect('/admin/books/' + book._id);
        });
    });
});

router.get('/',async function(req,res,next) {
    const query = req.query.query;

    var start = Date.now();
    let books_list = await (query == null?books(req).getAll():books(req).search(query));
    var end = Date.now();
    var msElapsed = end - start;
    console.log(`Async function took ${msElapsed / 1000} seconds to complete.`);
    return render(req,res,'admin/books/books',{
        books:books_list
    });
});

router.post('/:book_id/redact',async function(req,res,next) {

    let book = await books(req).get(req.params.book_id);
    if(book == null){
        res.status(404);
        return res.send();
    }
    let filedata = req.file;

    let authors = Array.isArray(req.body.authors)?req.body.authors:[req.body.authors];
    let genres = Array.isArray(req.body.genres)?req.body.genres:[req.body.genres];
    let tags = req.body.tags === undefined?[]:Array.isArray(req.body.tags)?req.body.tags:[req.body.tags];

    const price = Math.round(100 *parseFloat(req.body.price));
    const quantity = req.body.quantity;

    const description = req.body.description;
    const title = req.body.title;

    if(filedata !== undefined){
        const items = filedata.originalname.split('\\')
        const filename = filedata.filename + '.' + items[items.length - 1]
        fs.rename(filedata.path,'public/img/' + filename,function(err){
            console.log(err);
            books(req).redact(req.params.book_id, title,price,quantity,description,req.body.isbn,filename,genres,authors,tags).then(val =>{
                res.redirect('back');
            });
        });
    }else {
        await books(req).redact(req.params.book_id, title,price,quantity,description,req.body.isbn,null,genres,authors,tags);
        res.redirect('back');
    }
});


router.post('/:book_id/remove',async function(req,res,next) {
    await books(req).remove(req.params.book_id);
    res.redirect('/admin/books');
});

router.get('/:book_id',async function(req,res,next) {

    let book = await books(req).get(req.params.book_id);

    if(book == null){
        res.status(404);
        return res.send();
    }

    book.authors = book.authors.map(val => val._id.toString());
    book.tags = book.tags.map(val => val._id.toString());
    book.genres = book.genres.map(val => val._id.toString());

    let genres_list = (await genres(req).getAll()).map(item =>{
        item._id = item._id.toString();
        return item;
    });
    let authors_list = (await authors(req).getAll()).map(item =>{
        item._id = item._id.toString();
        return item;
    });
    let tags_list = (await tags(req).getAll()).map(item =>{
        item._id = item._id.toString();
        return item;
    });

    return render(req,res,'admin/books/book',{
        book:book,
        authors_list:authors_list,
        genres_list:genres_list,
        tags_list:tags_list,
        lists:await lists.Lists(req).getList()
    });
});


module.exports = router;