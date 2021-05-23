var express = require('express');
var router = express.Router();
const genres = require('../..//models/genres');
const render = require('../../app/render');
const fs = require('fs');

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
    let filedata = req.file;
    if(filedata === undefined){
        return res.redirect('back');
    }
    const items = filedata.originalname.split('.');
    const filename = filedata.filename + '.' + items[items.length - 1];
    console.log(filename);
    fs.rename(filedata.path,'public/img/' + filename,function(err){
        genres.add(req.body.title,filename).then(genre => {
            res.redirect('/admin/genres/');
        });
    });
});
router.post('/:genre_id/remove',async function(req,res,next) {
    await genres.remove(req.params.genre_id);
    res.redirect('back');
});
router.post('/:genre_id/rename',async function(req,res,next) {
    let filedata = req.file;
    if(filedata !== undefined){
        const items = filedata.originalname.split('\\')
        const filename = filedata.filename + '.' + items[items.length - 1]
        fs.rename(filedata.path,'public/img/' + filename,function(err){
            console.log(err);
            genres.rename(req.params.genre_id,req.body.title,filename).then(val =>{
                res.redirect('back');
            });
        });
    }else {
        await genres.rename(req.params.genre_id,req.body.title,null);
        res.redirect('back');
    }
});









module.exports = router;