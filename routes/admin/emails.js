const express = require('express');
const router = express.Router();
const emailsController = require('../../controllers/Admin/EmailsController');

router.use(async function(req,res,next) {
    //Пользователь не администратор и не менеджер по продажам
    if(req.user.role != 3 && req.user.role != 1){
        res.status(403);
        return res.send();
    }
    next();
});

router.get('/', emailsController.index);

router.post('/:email/remove', emailsController.remove);

module.exports = router;
