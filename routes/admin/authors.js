var express = require('express');
var router = express.Router();
const authors = require('../..//models/authors');
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

router.post('/add',async function(req,res,next) {
    let filedata = req.file;
    if(filedata === undefined){
        return res.redirect('back');
    }
    const items = filedata.originalname.split('.');
    const filename = filedata.filename + '.' + items[items.length - 1];
    fs.rename(filedata.path,'public/img/' + filename,function(err){
        authors.add(req.body.firstname.trim(),req.body.lastname.trim(),filename).then(val =>{
            res.redirect('back');
        });
    });
});
router.post('/:author_id/remove',async function(req,res,next) {
    let author = await authors.get(req.params.author_id);
    await authors.remove(req.params.author_id);
    fs.unlinkSync('public/img/' + author.author_img);
    res.redirect('back');
});
router.post('/:author_id/redact',async function(req,res,next) {
    let filedata = req.file;
    if(filedata !== undefined){
        const items = filedata.originalname.split('\\')
        const filename = filedata.filename + '.' + items[items.length - 1]
        console.log(filename);
        fs.rename(filedata.path,'public/img/' + filename,function(err){
            console.log(err);
            authors.redact(req.params.author_id, req.body.firstname, req.body.lastname, filename).then(val =>{
                res.redirect('back');
            });
        });
    }else {
        await authors.redact(req.params.author_id, req.body.firstname, req.body.lastname);
        res.redirect('back');
    }

});

router.get('/',async function(req,res,next){
    let authors_list = await authors.getAll();
    render(req,res,'admin/authors',{authors: authors_list})
});


module.exports = router;