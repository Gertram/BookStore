const express = require('express');
const router = express.Router();
const ordersController = require('../../controllers/Admin/AdminOrdersController');

router.use(async function(req,res,next) {
    //Пользователь не администратор и не менеджер по продажам
    if(req.user.role != 4 && req.user.role != 1){
        res.status(403);
        return res.send();
    }
    next();
});

router.get('/',ordersController.index);

router.get('/goto',ordersController.goto);

router.post('/:order_id/next',ordersController.next);

router.get('/:order_id',ordersController.order);

module.exports = router;