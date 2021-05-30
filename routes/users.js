var express = require('express');
var router = express.Router();
const users = require('../models/users');
const render = require('../app/render');

/* GET users listing. */
router.get('/:user_id', async function(req, res, next) {
  let user_id = req.cookies.user;
  if(user_id == null){
    return res.redirect('.login');
  }
  let user = await users(req).get(req.params.user_id);
  if(user.length == 0){
    return res.status(301);
  }
  user = user[0];

  render(req,res,'users/user',user);
});

router.post('/:user_id/redact',async function (req,res,next) {
    await users(req).save(req.params.user_id,req.body.email,req.body.username,req.body.phone);
    res.redirect('back');
});
router.post('/:user_id/save_password',async function (req,res,next) {
    await users(req).save_password(req.params.user_id,req.body.password);
  res.redirect('back');
});

module.exports = router;
