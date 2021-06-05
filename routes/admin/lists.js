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
    let mlists = await lists.Lists(req).getAll();

   return render(req,res,'admin/lists', {
        lists:mlists
    })
});

/*router.get('/:list_id/add', async function (req, res, next) {
    let list_id = req.params.list_id;
    let books_list = await books(req).getAll();

    let releases = await lists.List(list_id,req).getAll();

    releases = releases.map(val => val['_id'].toString());

    books_list = books_list.filter(val => !releases.includes(val['_id'].toString()));
    return render(req,res,'admin/list_add.twig', {list_id: list_id, books: books_list});
});*/

router.post('/:list_id/remove', async function (req, res, next) {
    let list = lists.List(req.params.list_id,req);
    const book_id = req.body.book_id;

    await list.remove(book_id);

    res.redirect('back');
});
router.post('/add', async function (req, res, next) {
    let list = lists.List(req.body.list_id,req);
    const book_id = req.body.book_id;

    let books_list = await list.getAll();

    if(books_list.length === 4){
        return res.send("Список полон");
    }

    books_list = books_list.map(item => item._id.toString());

    for(let i = 0;i < books_list.length;i++){
        if(book_id == books_list[i]){
            return res.send("Книга уже в списке");
        }
    }

    await list.add(book_id);

    res.redirect('back');
});

module.exports = router;