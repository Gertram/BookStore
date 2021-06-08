const express = require('express');
const router = express.Router();
const listsController = require('../../controllers/Admin/ListsController');

router.use(async function(req,res,next) {
    //Пользователь не администратор и не менеджер по продажам
    if(req.user.role != 3 && req.user.role != 1){
        res.status(403);
        return res.send();
    }
    next();
});

router.get('/', listsController.index);

/*router.get('/:list_id/add', async function (req, res, next) {
    let list_id = req.params.list_id;
    let books_list = await books(req).getAll();

    let releases = await lists.List(list_id,req).getAll();

    releases = releases.map(val => val['_id'].toString());

    books_list = books_list.filter(val => !releases.includes(val['_id'].toString()));
    return render(req,res,'admin/list_add.twig', {list_id: list_id, books: books_list});
});*/

router.post('/:list_id/remove', listsController.remove);

router.post('/add', listsController.add);

module.exports = router;