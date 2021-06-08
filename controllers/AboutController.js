const render = require('../app/render');

class AboutController{
    static async index(req, res, next) {
        return render(req,res,"about/about", { nav: 'about' });
    }
}

module.exports = AboutController;