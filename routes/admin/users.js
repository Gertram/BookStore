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
    let users_list = await users.getAll();
    render(req,res,'admin/users/users',{users: users_list})
});

router.post('/:user_id/redact',async function(req,res,next){
    let user = await users.get(req.params.user_id);
    if(user.length == 0){
        res.status(404);
        return res.send();
    }

    await users.save(req.params.user_id,req.body.email,req.body.username,req.body.phone);

    const password = req.body.password;

    if(password.length != 0){
        await users.save_password(req.params.user_id,password);
    }

   res.redirect('back');
});

router.post('/:user_id/remove',async function(req,res,next){
    let user = await users.get(req.params.user_id);
    if(user.length == 0){
        res.status(404);
        return res.send();
    }

    await users.remove(req.params.user_id);

    res.redirect('/admin/users')
});

router.get('/:user_id',async function(req,res,next){
    let user = await users.get(req.params.user_id);
    if(user.length == 0){
        res.status(404);
        return res.send();
    }

    render(req,res,'admin/users/user',user[0])
});

module.exports = router;