const reviews = require('../..//models/reviews');
const render = require('../../app/render');

class ReviewsController{
    static async index(req,res,next){
        let reviews_list = await reviews(req).getAllWithBook();

        return render(req,res,'admin/reviews/reviews',{reviews: reviews_list})
    }
    static async reject(req,res,next) {
        let review = await reviews(req).get(req.params.review_id);
        if(review.length == 0){
            res.status(404);
            return res.send();
        }
        await reviews(req).reject(req.params.review_id,req.user.user_id,req.body.cause);
        res.redirect('back');
    }
    static async approve(req,res,next) {
        let review = await reviews(req).get(req.params.review_id);
        if(review.length == 0){
            res.status(404);
            return res.send();
        }
        await reviews(req).approve(req.params.review_id,req.user.user_id);
        res.redirect('back');
    }
    static async remove(req,res,next) {
        let review = await reviews(req).get(req.params.review_id);
        if(review.length == 0){
            res.status(404);
            return res.send();
        }
        await reviews(req).remove(req.params.review_id);
        res.redirect('/admin/reviews');
    }
    static async review(req,res,next){
        let review = await reviews(req).get(req.params.review_id);
        if(review == null){
            res.status(404);
            return res.send();
        }

        return render(req,res,'admin/reviews/review',review)
    }
}

module.exports = ReviewsController;