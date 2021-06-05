var express = require('express');
var router = express.Router();
const reviews = require('../..//models/reviews');
const render = require('../../app/render');

router.use(async function(req,res,next) {
    //Пользователь не администратор и не менеджер по продажам
    if(req.user.role != 1){
        res.status(403);
        return res.send();
    }
    next();
});

router.post('/:review_id/reject',async function(req,res,next) {
    let review = await reviews(req).get(req.params.review_id);
    if(review.length == 0){
        res.status(404);
        return res.send();
    }
    await reviews(req).reject(req.params.review_id,req.user.user_id,req.body.cause);
    res.redirect('back');
});
router.post('/:review_id/approve',async function(req,res,next) {
    let review = await reviews(req).get(req.params.review_id);
    if(review.length == 0){
        res.status(404);
        return res.send();
    }
    await reviews(req).approve(req.params.review_id,req.user.user_id);
    res.redirect('back');
});
router.post('/:review_id/remove',async function(req,res,next) {
    let review = await reviews(req).get(req.params.review_id);
    if(review.length == 0){
        res.status(404);
        return res.send();
    }
    await reviews(req).remove(req.params.review_id);
    res.redirect('/admin/reviews');
});

router.get('/',async function(req,res,next){
    let reviews_list = await reviews(req).getAllWithBook();
    console.log(reviews_list);
    return render(req,res,'admin/reviews/reviews',{reviews: reviews_list})
});
router.get('/:review_id',async function(req,res,next){
    let review = await reviews(req).get(req.params.review_id);
    if(review == null){
        res.status(404);
        return res.send();
    }

    return render(req,res,'admin/reviews/review',review)
});









module.exports = router;