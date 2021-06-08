const express = require('express');
const router = express.Router();
const deliveriesController = require('../../controllers/Admin/DeliveriesController');

router.use(async function(req,res,next) {
    //Пользователь не администратор и не менеджер по продажам
    if(req.user.role != 4 && req.user.role != 1){
        res.status(403);
        return res.send();
    }
    next();
});


router.post('/remove',deliveriesController.remove);

router.get('/',deliveriesController.index);

router.post('/:delivery_id/close',deliveriesController.close);

router.post('/:delivery_id/add',deliveriesController.add);

router.get('/:delivery_id',deliveriesController.delivery);

module.exports = router;