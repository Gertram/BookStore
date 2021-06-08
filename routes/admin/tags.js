const express = require('express');
const router = express.Router();
const tagsController = require('../../controllers/Admin/TagsController');

router.use(async function (req, res, next) {
    //Пользователь не администратор и не менеджер по продажам
    if (req.user.role != 3 && req.user.role != 1) {
        res.status(403);
        return res.send();
    }
    next();
});

router.get('/', tagsController.index);

router.post('/add', tagsController.add);

router.post('/:tag_id/remove', tagsController.remove);

router.post('/:tag_id/rename',tagsController.rename);


module.exports = router;