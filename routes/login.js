var express = require('express');
var router = express.Router();
const users = require('../models/users')

/* GET home page. */
router.get('/', async function(req, res, next) {
    if(req.cookies.user == null) {
        res.render("login/login", {title: 'Login'});
        return;
    }
    res.render('login/already_login');
});

router.post('/exit',async function(req,res,next) {
   if(req.cookies.user == null){
       res.redirect('back');
       return;
   }

   res.cookie('user',null,{maxAge: 0});
   res.redirect('back');
});

/* GET home page. */
router.post('/', async function(req, res, next) {
    let login = req.body.login;
    let password = req.body.password;

    let user = await users.login(login,password);

    if(user.length === 0){
        res.redirect('back');
        return;
    }

    user = user[0];

    res.cookie('user',user.user_id, {maxAge: 90000000, httpOnly: true, secure: false, overwrite: false})
    res.redirect('/user/' + user.user_id);
});

module.exports = router;
