const render = require('../app/render');
const emails = require('../models/emails');

class EmailsController{
    static async add(req, res, next) {
        await emails(req).add(req.body.email);
        return render(req,res,'contacts/answer');
    }
}

module.exports = EmailsController;