const express = require('express');
const router = express.Router();
const authors = require('../..//models/providers');
const render = require('../../app/render');

router.use(async function(req,res,next) {
    //Пользователь не администратор и не менеджер по продажам
    if(req.user.role != 4 && req.user.role != 1){
        res.status(403);
        return res.send();
    }
    next();
});

/*router.post('/add',async function(req,res,next) {
    await authors.add(req.body.firstname,req.body.lastname);
    res.redirect('/admin');
});
router.post('/remove',async function(req,res,next) {
    await authors.remove(req.body.author);
    res.redirect('/admin');
});

router.get('/',async function(req,res,next){
    let authors_list = await authors.getAll();
    render(req,res,'admin/authors',{authors: authors_list})
});*/

module.exports = router;