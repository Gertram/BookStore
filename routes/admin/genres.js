const express = require('express');
const router = express.Router();
const genresController = require('../../controllers/Admin/GenresController');

router.use(async function(req,res,next) {
    //Пользователь не администратор и не менеджер по продажам
    if(req.user.role != 3 && req.user.role != 1){
        res.status(403);
        return res.send();
    }
    next();
});

router.get('/',genresController.index);

router.post('/add',genresController.add);
router.post('/:genre_id/remove',genresController.remove);
router.post('/:genre_id/rename',genresController.rename);









module.exports = router;