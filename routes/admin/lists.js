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

router.post('/:list_id/remove', listsController.remove);

router.post('/add', listsController.add);

module.exports = router;