const books = require('../models/books');
const render = require('../app/render');

class SearchController{
    static async index(req, res, next) {
        return render(req,res,"search/search", { title: 'Search' });
    }
    static async query(req, res, next) {
        let books_list = await books(req).search(req.query.query);
        return render(req,res,"search/search", { title: 'Search',results:books_list });
    }
}

module.exports = SearchController;