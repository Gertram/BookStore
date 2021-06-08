const render = require('../app/render');
const contacts = require('../models/contacts');

class ContactsController{
    static async index(req, res, next) {
        return render(req,res,"contacts/contacts", { nav: 'contacts' });
    }
    static async contact(req, res, next) {
        await contacts(req).add(req.body.name,req.body.email,req.body.question,req.body.message);
        return render(req,res,'contacts/answer');
    }
}

module.exports = ContactsController;