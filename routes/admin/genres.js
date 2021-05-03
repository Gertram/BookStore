var express = require('express');
var router = express.Router();
const genres = require('../..//models/genres');

router.post('/add',async function(req,res,next) {
    await genres.add(req.body.title);
    res.redirect('/admin');
});
router.post('/remove',async function(req,res,next) {
    await genres.remove(req.body.genre);
    res.redirect('/admin');
});









module.exports = router;