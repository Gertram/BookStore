const express = require('express');
const router = express.Router();
const reviewsController = require('../../controllers/Admin/ReviewsController');

router.use(async function(req,res,next) {
    //Пользователь не администратор и не менеджер по продажам
    if(req.user.role != 1){
        res.status(403);
        return res.send();
    }
    next();
});

router.post('/:review_id/reject',reviewsController.reject);

router.post('/:review_id/approve',reviewsController.approve);

router.post('/:review_id/remove',reviewsController.remove);

router.get('/',reviewsController.index);

router.get('/:review_id',reviewsController.review);

module.exports = router;