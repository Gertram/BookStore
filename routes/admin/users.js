const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/Admin/UsersController');


router.use(async function(req,res,next) {
    //Пользователь не администратор и не менеджер по продажам
    if(req.user.role != 1){
        res.status(403);
        return res.send();
    }
    next();
});

router.get('/',usersController.index);

router.post('/:user_id/redact',usersController.redact);

router.post('/:user_id/remove',usersController.remove);

router.get('/add',usersController.getAdd);

router.post('/add',usersController.add);

router.get('/:user_id',);

module.exports = router;