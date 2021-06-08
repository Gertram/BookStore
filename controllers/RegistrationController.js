const users = require('../models/users');
const render = require('../app/render');

class RegistrationController{
    static async index(req, res, next) {
        return render(req,res,"registration/registration", { title: 'registration' });
    }
    static async registration(req, res, next) {
        let email = req.body.email;
        let password = req.body.password;
        let username = req.body.username;

        let user = await users(req).create(email,password,username,5);

        if(user === 'duplicate'){
            res.redirect('back');
        }

        res.cookie('user',user._id, {maxAge: 90000000, httpOnly: true, secure: false, overwrite: false})

        res.redirect('/users/' + user._id);
    }
}

module.exports = RegistrationController;