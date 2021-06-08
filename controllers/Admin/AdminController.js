const render = require('../app/render');

class AdminController{
    static async index(req, res, next) {
        return render(req,res,"admin/admin");
    }
}

module.exports = AdminController;