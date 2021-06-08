const users = require('../models/users');
const render = require('../app/render');


class LoginController{
    static async index(req, res, next) {
        if(req.cookies.user == null) {
            return render(req,res,"login/login", {title: 'Login'});
        }
        return render(req,res,'login/already_login');
    }
    static async logout(req,res,next) {
        if(req.cookies.user == null){
            res.redirect('back');
            return;
        }

        res.cookie('user',null,{maxAge: 0});
        res.redirect('back');
    }
    static async login(req, res, next) {
        let user = await users(req).login(req.body.login,req.body.password);

        if(user == null) {
            res.redirect('back');
            return;
        }

        res.cookie('user',user._id, {maxAge: 90000000, httpOnly: true, secure: false, overwrite: false})
        res.redirect('back');
    }
}

module.exports = LoginController;