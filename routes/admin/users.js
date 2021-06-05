var express = require('express');
var router = express.Router();
const users = require('../..//models/users');
const render = require('../../app/render');


router.use(async function(req,res,next) {
    //Пользователь не администратор и не менеджер по продажам
    if(req.user.role != 1){
        res.status(403);
        return res.send();
    }
    next();
});

router.get('/',async function(req,res,next){
    let users_list = await users(req).getAll();
    return render(req,res,'admin/users/users',{users: users_list})
});

router.post('/:user_id/redact',async function(req,res,next){
    let user = await users(req).get(req.params.user_id);
    if(user.length == 0){
        res.status(404);
        return res.send();
    }

    await users(req).save(req.params.user_id,req.body.email,req.body.username,req.body.phone,req.body.role);

    const password = req.body.password;

    if(password.length != 0){
        await users(req).save_password(req.params.user_id,password);
    }

   res.redirect('back');
});

router.post('/:user_id/remove',async function(req,res,next){
    let user = await users(req).get(req.params.user_id);
    if(user.length == 0){
        res.status(404);
        return res.send();
    }

    await users(req).remove(req.params.user_id);

    res.redirect('/admin/users')
});

router.get('/add',async function(req,res,next){
    return render(req,res,'admin/users/add_user');
});
router.post('/add',async function(req,res,next){
    let user = await users(req).create(req.body.email,req.body.password,req.body.username,req.body.role,req.body.phone);

    res.redirect('/admin/users/' + user._id);
});

router.get('/:user_id',async function(req,res,next){
    let user = await users(req).get(req.params.user_id);
    if(user == null){
        res.status(404);
        return res.send();
    }

    return render(req,res,'admin/users/user',user)
});

module.exports = router;