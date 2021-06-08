const express = require('express');
const router = express.Router();
const featuredBestSellersController = require('../../controllers/Admin/FeaturedBestSellersController');

router.use(async function(req,res,next) {
    //Пользователь не администратор и не менеджер по продажам
    if(req.user.role != 3 && req.user.role != 1){
        res.status(403);
        return res.send();
    }
    next();
});

router.get('/', featuredBestSellersController.index);

router.get('/add', featuredBestSellersController.getAdd);

router.post('/remove', featuredBestSellersController.remove);

router.post('/add', featuredBestSellersController.add);

module.exports = router;