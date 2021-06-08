const express = require('express');
const router = express.Router();
const authorsController = require('../../controllers/Admin/AuthorsController');

router.use(async function(req,res,next) {
    //Пользователь не администратор и не менеджер по продажам
   if(req.user.role != 3 && req.user.role != 1){
       res.status(403);
       return res.send();
   }
   next();
});

router.post('/add',authorsController.add);
router.post('/:author_id/remove',authorsController.remove);
router.post('/:author_id/redact',authorsController.redact);

router.get('/',authorsController.index);


module.exports = router;