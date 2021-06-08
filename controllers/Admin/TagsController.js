const tags = require('../..//models/tags');
const render = require('../../app/render');
const fs = require('fs');

class TagsController{
    static async index (req, res, next) {
        let tags_list = await tags(req).getAll();
        return render(req, res, 'admin/tags', {tags: tags_list})
    }
    static async add (req, res, next) {
        const genre = await tags(req).add(req.body.title);
        res.redirect('/admin/tags/');
    }
    static async remove (req, res, next) {
        await tags(req).remove(req.params.tag_id);
        res.redirect('back');
    }
    static async rename (req, res, next) {
        await tags(req).rename(req.params.tag_id, req.body.title);
        res.redirect('back');
    }
}

module.exports = TagsController;