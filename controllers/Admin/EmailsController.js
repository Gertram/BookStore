const render = require('../../app/render');
const emails = require('../../models/contacts');

class EmailsController{
    static async index(req, res, next) {
        return render(req,res,"admin/emails/emails", { requests:await emails(req).getAll() });
    }
    static async remove(req, res, next) {
        await emails(req).remove(req.params.email);
        res.redirect('back');
    }
}

module.exports = EmailsController;