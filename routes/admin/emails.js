var express = require('express');
var router = express.Router();
const render = require('../../app/render');
const emails = require('../../models/contacts');

router.use(async function(req,res,next) {
    //Пользователь не администратор и не менеджер по продажам
    if(req.user.role != 3 && req.user.role != 1){
        res.status(403);
        return res.send();
    }
    next();
});

/* GET home page. */
router.get('/', async function(req, res, next) {
    return render(req,res,"admin/emails/emails", { requests:await emails(req).getAll() });
});
/* GET home page. */
router.post('/:email/remove', async function(req, res, next) {
    await emails(req).remove(req.params.email);
    res.redirect('back');
});

module.exports = router;
