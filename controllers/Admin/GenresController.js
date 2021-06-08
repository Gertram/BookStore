const genres = require('../..//models/genres');
const render = require('../../app/render');
const fs = require('fs');

class GenresController{
    static async index(req,res,next) {
        let genres_list = await genres(req).getAll();
        return render(req,res,'admin/genres',{genres: genres_list})
    }
    static async add(req,res,next) {
        let filedata = req.file;
        if(filedata === undefined){
            return res.redirect('back');
        }
        const items = filedata.originalname.split('.');
        const filename = filedata.filename + '.' + items[items.length - 1];
        fs.rename(filedata.path,'public/img/' + filename,function(err){
            genres(req).add(req.body.title,filename).then(genre => {
                res.redirect('/admin/genres/');
            });
        });
    }
    static async remove(req,res,next) {
        await genres(req).remove(req.params.genre_id);
        res.redirect('back');
    }
    static async rename(req,res,next) {
        let filedata = req.file;
        if(filedata !== undefined){
            const items = filedata.originalname.split('\\')
            const filename = filedata.filename + '.' + items[items.length - 1]
            fs.rename(filedata.path,'public/img/' + filename,function(err){
                genres(req).rename(req.params.genre_id,req.body.title,filename).then(val =>{
                    res.redirect('back');
                });
            });
        }else {
            await genres(req).rename(req.params.genre_id,req.body.title,null);
            res.redirect('back');
        }
    }
}

module.exports = GenresController;