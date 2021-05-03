var express = require('express');
var router = express.Router();
const users = require('../models/users')

/* GET home page. */
router.get('/', async function(req, res, next) {

    res.render("login/login", { title: 'Login' });
});
/* GET home page. */
router.post('/', async function(req, res, next) {
    let login = req.body.login;
    let password = req.body.password;

    let user = await users.login(login,password);

    console.log(user);

    res.send(user);
});

module.exports = router;
