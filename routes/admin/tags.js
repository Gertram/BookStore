var express = require('express');
var router = express.Router();
const tags = require('../..//models/tags');
const render = require('../../app/render');
const fs = require('fs');

router.use(async function (req, res, next) {
    //Пользователь не администратор и не менеджер по продажам
    if (req.user.role != 3 && req.user.role != 1) {
        res.status(403);
        return res.send();
    }
    next();
});

router.get('/', async function (req, res, next) {
    let tags_list = await tags(req).getAll();
    render(req, res, 'admin/tags', {tags: tags_list})
});

router.post('/add', async function (req, res, next) {
    const genre = await tags(req).add(req.body.title);
    res.redirect('/admin/tags/');
});
router.post('/:tag_id/remove', async function (req, res, next) {
    await tags(req).remove(req.params.tag_id);
    res.redirect('back');
});
router.post('/:tag_id/rename', async function (req, res, next) {
    await tags(req).rename(req.params.tag_id, req.body.title);
    res.redirect('back');
});


module.exports = router;