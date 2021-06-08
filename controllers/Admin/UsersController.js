const users = require('../..//models/users');
const render = require('../../app/render');

class UsersController{
    static async index(req,res,next){
        let users_list = await users(req).getAll();
        return render(req,res,'admin/users/users',{users: users_list})
    }
    static async redact(req,res,next){
        let user = await users(req).get(req.params.user_id);
        if(user.length == 0){
            res.status(404);
            return res.send();
        }

        await users(req).save(req.params.user_id,req.body.email,req.body.username,req.body.phone,req.body.role);

        const password = req.body.password;

        if(password.length != 0){
            await users(req).save_password(req.params.user_id,password);
        }

        res.redirect('back');
    }
    static async getAdd(req,res,next){
        return render(req,res,'admin/users/add_user');
    }
    static async add(req,res,next){
        let user = await users(req).create(req.body.email,req.body.password,req.body.username,req.body.role,req.body.phone);

        res.redirect('/admin/users/' + user._id);
    }
    static async remove(req,res,next){
        let user = await users(req).get(req.params.user_id);
        if(user.length == 0){
            res.status(404);
            return res.send();
        }

        await users(req).remove(req.params.user_id);

        res.redirect('/admin/users')
    }
    static async user(req,res,next){
        let user = await users(req).get(req.params.user_id);
        if(user == null){
            res.status(404);
            return res.send();
        }

        return render(req,res,'admin/users/user',user)
    }
}

module.exports = UsersController;