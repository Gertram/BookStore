const express = require('express');
const router = express.Router();
const providers = require('../..//models/providers');

const deliveries = require('../..//models/deliveries');
const render = require('../../app/render');

router.use(async function(req,res,next) {
    //Пользователь не администратор и не менеджер по продажам
    if(req.user.role != 4 && req.user.role != 1){
        res.status(403);
        return res.send();
    }
    next();
});

router.post('/add',async function(req,res,next) {
    await providers.add(req.body.name,req.body.phone);
    res.redirect('back');
});

router.post('/remove',async function(req,res,next) {
    await providers.remove(req.body.provider);
    res.redirect('back');
});

router.get('/',async function(req,res,next){
    let providers_list = await providers.getAll();
    render(req,res,'admin/providers/providers',{providers: providers_list})
});

router.get('/:provider_id',async function(req,res,next){
    console.log(req.params);
    let provider = await providers.get(req.params.provider_id);
    if(provider == null){
        res.status(404);
        return res.send();
    }
    render(req,res,'admin/providers/provider',provider)
});

router.post('/:provider_id/add',async function(req,res,next) {
    let provider = await providers.get(req.params.provider_id);
    if(provider == null){
        res.status(404);
        return res.send();
    }

    console.log(req.user._id);

    let delivery = await deliveries.open(provider._id,req.user._id);

    res.redirect('/admin/deliveries/' + delivery._id);
});

module.exports = router;