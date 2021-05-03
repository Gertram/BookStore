var express = require('express');
var router = express.Router();
const authors = require('../..//models/authors');

router.post('/add',async function(req,res,next) {
    await authors.add(req.body.firstname,req.body.lastname);
    res.redirect('/admin');
});
router.post('/remove',async function(req,res,next) {
    await authors.remove(req.body.author);
    res.redirect('/admin');
});

router.get('/',async function(req,res,next){

});









module.exports = router;