const express = require('express');
const router = express.Router();
const booksController = require('../../controllers/Admin/BooksController');

router.use(async function(req,res,next) {
    //Пользователь не администратор и не менеджер по продажам
    if(req.user.role != 3 && req.user.role != 1){
        res.status(403);
        return res.send();
    }
    next();
});

router.get('/add',booksController.getAdd);

router.post('/add',booksController.add);

router.get('/', booksController.index);

router.post('/:book_id/redact',booksController.redact);

router.post('/:book_id/remove',booksController.remove);

router.get('/:book_id',booksController.book);


module.exports = router;