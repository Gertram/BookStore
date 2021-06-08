const express = require('express');
const router = express.Router();
const providersController = require('../../controllers/Admin/ProvidersController');

router.use(async function(req,res,next) {
    //Пользователь не администратор и не менеджер по продажам
    if(req.user.role != 4 && req.user.role != 1){
        res.status(403);
        return res.send();
    }
    next();
});

router.post('/add',providersController.add);

router.post('/remove',providersController.remove);

router.get('/',providersController.index);

router.get('/:provider_id',providersController.provider);

router.post('/:provider_id/add',providersController.newDelivery);

module.exports = router;