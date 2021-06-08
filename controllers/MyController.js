const users = require('../models/users');
const render = require('../app/render');

class MyController{
    static async index(req, res, next) {
        let user = await users(req).get(req.user._id);
        if(user == null){
            return res.status(301);
        }

        return render(req,res,'my/my',user);
    }
    static async redact(req,res,next) {
        await users(req).save(req.user._id,req.body.email,req.body.username,req.body.phone);
        res.redirect('back');
    }
    static async savePassword(req,res,next) {
        await users(req).save_password(req.user._id,req.body.password);
        res.redirect('back');
    }
}

module.exports = MyController;