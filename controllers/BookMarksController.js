const render = require('../app/render');
const users = require('../models/users');
const books = require('../models/books');
const orders = require('../models/orders');
const bookmarks = require('../models/bookmarks');

class BookMarksController{
    static async index(req, res, next) {
        let products = await bookmarks(req,res).products();

        return render(req,res,"bookmarks/bookmarks", { mbookmarks: products});
    }
    static async add(req, res, next) {
        let product = req.body.book_id;

        await bookmarks(req,res).add(product);

        res.redirect('back');
    }
    static async remove(req,res,next) {
        let product = req.body.book_id;
        await bookmarks(req,res).remove(product);

        res.redirect('back');
    }
}

module.exports = BookMarksController;