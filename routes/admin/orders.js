const express = require('express');
const router = express.Router();
const orders = require('../..//models/orders');

const render = require('../../app/render');

router.use(async function(req,res,next) {
    //Пользователь не администратор и не менеджер по продажам
    if(req.user.role != 4 && req.user.role != 1){
        res.status(403);
        return res.send();
    }
    next();
});

router.get('/',async function(req,res,next){
    const sortby = req.query.sortby;
    const mindate = req.query.mindate;
    const maxdate = req.query.maxdate;
    const customer = req.query.customer;
    const status = req.query.status;
    let orders_list = await orders(req).getAll({mindate:mindate,maxdate:maxdate,customer:customer,status:status},sortby);
    return render(req,res,'admin/orders/orders',{orders: orders_list})
});

router.get('/goto',async function(req,res,next){
    return res.redirect('/admin/orders/' + req.query.order.trim());
});

router.post('/:order_id/next',async function(req,res,next){
    await orders(req).next(req.params.order_id);
    return res.redirect('back');
});

router.get('/:order_id',async function(req,res,next){
    console.log(req.params);
    let order = await orders(req).get(req.params.order_id);
    if(order == null){
        res.status(404);
        return res.send();
    }
    return render(req,res,'admin/orders/order',{order:order})
});

/*router.post('/:provider_id/add',async function(req,res,next) {
    let provider = await providers(req).get(req.params.provider_id);
    if(provider == null){
        res.status(404);
        return res.send();
    }

    console.log(req.user._id);

    let delivery = await deliveries(req).open(provider._id,req.user._id);

    res.redirect('/admin/deliveries/' + delivery._id);
});*/

module.exports = router;