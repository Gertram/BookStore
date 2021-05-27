var express = require('express');
var router = express.Router();
const users = require('../models/users');
const render = require('../app/render');

/* GET home page. */
router.get('/', async function(req, res, next) {

    render(req,res,"registration/registration", { title: 'registration' });
});
/* GET home page. */
router.post('/', async function(req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;

    let user = await users.create(email,password,username,5);

    if(user === 'duplicate'){
        res.redirect('back');
    }

    res.cookie('user',user._id, {maxAge: 90000000, httpOnly: true, secure: false, overwrite: false})

    res.redirect('/users/' + user._id);
});

module.exports = router;
