var express = require('express');
var router = express.Router();
const genres = require('../..//models/genres');
const render = require('../../app/render');

router.use(async function(req,res,next) {
    //Пользователь не администратор и не менеджер по продажам
    if(req.user.role != 3 && req.user.role != 1){
        res.status(403);
        return res.send();
    }
    next();
});

router.get('/',async function(req,res,next) {
    let genres_list = await genres.getAll();
    render(req,res,'admin/genres',{genres: genres_list})
});

router.post('/add',async function(req,res,next) {
    await genres.add(req.body.title);
    res.redirect('/admin');
});
router.post('/remove',async function(req,res,next) {
    await genres.remove(req.body.genre);
    res.redirect('/admin');
});









module.exports = router;