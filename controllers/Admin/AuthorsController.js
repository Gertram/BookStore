const authors = require('../..//models/authors');
const render = require('../../app/render');
const fs = require('fs');

class AuthorsController{
    static async index(req,res,next){
        let authors_list = await authors(req).getAll();
        return render(req,res,'admin/authors',{authors: authors_list})
    }
    static async add(req,res,next) {
        let filedata = req.file;
        if(filedata === undefined){
            return res.redirect('back');
        }
        const items = filedata.originalname.split('.');
        const filename = filedata.filename + '.' + items[items.length - 1];
        fs.rename(filedata.path,'public/img/' + filename,function(err){
            authors(req).add(req.body.firstname.trim(),req.body.lastname.trim(),filename).then(val =>{
                res.redirect('back');
            });
        });
    }
    static async remove(req,res,next) {
        let author = await authors(req).get(req.params.author_id);
        await authors(req).remove(req.params.author_id);
        fs.unlinkSync('public/img/' + author.author_img);
        res.redirect('back');
    }
    static async redact(req,res,next) {
        let filedata = req.file;
        if(filedata !== undefined){
            const items = filedata.originalname.split('\\')
            const filename = filedata.filename + '.' + items[items.length - 1]
            console.log(filename);
            fs.rename(filedata.path,'public/img/' + filename,function(err){
                console.log(err);
                authors(req).redact(req.params.author_id, req.body.firstname, req.body.lastname, filename).then(val =>{
                    res.redirect('back');
                });
            });
        }else {
            await authors(req).redact(req.params.author_id, req.body.firstname, req.body.lastname);
            res.redirect('back');
        }

    }
}

module.exports = AuthorsController;