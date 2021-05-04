const users = require('../models/users');

function render(req,res,template,items) {
    if(req.cookies.user != null) {
        return users.get(req.cookies.user).then(data=>{
            items['huser'] = data[0]
            res.render(template, items);
        });
    }
    res.render(template, items);
}

module.exports = render;