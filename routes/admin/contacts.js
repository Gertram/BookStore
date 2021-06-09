const express = require('express');
const router = express.Router();
const contactsController = require('../../controllers/Admin/AdminContactsController');

router.use(async function(req,res,next) {
    //Пользователь не администратор и не менеджер по продажам
    if(req.user.role != 3 && req.user.role != 1){
        res.status(403);
        return res.send();
    }
    next();
});

router.get('/', contactsController.index);

router.post('/:request/remove', contactsController.remove);

module.exports = router;
