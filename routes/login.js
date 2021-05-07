var express = require('express');
var router = express.Router();
const users = require('../models/users')
const render = require('../app/render');

/* GET home page. */
router.get('/', async function(req, res, next) {
    if(req.cookies.user == null) {
        render(req,res,"login/login", {title: 'Login'});
        return;
    }
    render(req,res,'login/already_login');
});

router.get('/logout',async function(req,res,next) {
   if(req.cookies.user == null){
       res.redirect('back');
       return;
   }

   res.cookie('user',null,{maxAge: 0});
   console.log(req);
   console.log(res);
   res.redirect('back');
});

/* GET home page. */
router.post('/', async function(req, res, next) {
    let login = req.body.login;
    let password = req.body.password;

    let user = await users.login(login,password);

    if(user.length == 0){
        res.redirect('back');
        return;
    }

    user = user[0];

    res.cookie('user',user.user_id, {maxAge: 90000000, httpOnly: true, secure: false, overwrite: false})
    res.redirect('back');
});

module.exports = router;
