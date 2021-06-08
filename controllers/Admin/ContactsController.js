const render = require('../../app/render');
const contacts = require('../../models/contacts');

class ContactsController{
    static async index(req, res, next) {
        return render(req,res,"admin/contacts/contacts", { requests:await contacts(req).getAll() });
    }
    static async remove(req, res, next) {
        await contacts(req).remove(req.params.request);
        res.redirect('back');
    }
}

module.exports = ContactsController;