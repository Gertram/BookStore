var express = require('express');
var router = express.Router();
const deliveries = require('../..//models/deliveries');
const books = require('../..//models/books');
const render = require('../../app/render');

router.use(async function(req,res,next) {
    //Пользователь не администратор и не менеджер по продажам
    if(req.user.role != 4 && req.user.role != 1){
        res.status(403);
        return res.send();
    }
    next();
});


router.post('/remove',async function(req,res,next) {
    await deliveries.remove(req.body.delivery);
    res.redirect('back');
});

router.get('/',async function(req,res,next){
    let deliveries_list = await deliveries.getAll();

    console.log(deliveries_list);

    render(req,res,'admin/deliveries/delivers',{deliveries: deliveries_list})
});

router.post('/:delivery_id/close',async function(req,res,next) {
    let delivery = await deliveries.get(req.params.delivery_id);
    if(delivery == null){
        res.status(404);
        return res.send();
    }

    await deliveries.close(delivery._id);
    res.redirect('back');
});

router.post('/:delivery_id/add',async function(req,res,next) {
    let delivery = await deliveries.get(req.params.delivery_id);
    if(delivery == null){
        res.status(404);
        return res.send();
    }

    await deliveries.add(delivery._id,req.body.product,req.body.count,req.body.cover);
    res.redirect('back');
});

router.get('/:delivery_id',async function(req,res,next){
    let delivery = await deliveries.get(req.params.delivery_id);
    if(delivery == null){
        res.status(404);
        return res.send();
    }

    render(req,res,'admin/deliveries/delivery',{delivery:delivery,books:await books.getAll()})
});

module.exports = router;