var express = require('express');
var router = express.Router();
const users = require('../models/users');
const render = require('../app/render');


router.use(function (req,res,next) {
    let user_id = req.cookies.user;
    if(user_id == null){
        return res.redirect('/login');
    }
    next();
});
/* GET users listing. */
router.get('/', async function(req, res, next) {
  let user = await users(req).get(req.user._id);
  if(user == null){
    return res.status(301);
  }



  return render(req,res,'my/my',user);
});

router.post('/redact',async function (req,res,next) {
    await users(req).save(req.user._id,req.body.email,req.body.username,req.body.phone);
    res.redirect('back');
});
router.post('/save_password',async function (req,res,next) {
    await users(req).save_password(req.user._id,req.body.password);
  res.redirect('back');
});

module.exports = router;
