const express = require('express');
const router = express.Router();
const myController = require('../controllers/MyController');


router.use(function (req,res,next) {
    let user_id = req.cookies.user;
    if(user_id == null){
        return res.redirect('/login');
    }
    next();
});

router.get('/', myController.index);

router.post('/redact',myController.redact);

router.post('/save_password',myController.savePassword);

module.exports = router;
