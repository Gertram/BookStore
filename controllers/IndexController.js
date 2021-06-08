const lists = require('../models/lists');
const genres = require('../models/genres');
const books = require('../models/books');
const authors = require('../models/authors');
const featured_bestsellers = require('../models/featured_bestsellers');
const render = require('../app/render');

class IndexController{
    static async index(req, res, next) {

        let mlists = await lists.Lists(req).getAll();
        let genres_list = await genres(req).getMostNumerous(4);
        let picked = await books(req).getMostPopular(4);
        let mostPopular = await authors(req).getMostPopular(4);
        let featured_bestsellers_list = await featured_bestsellers(req).getRandom();
        let new_list = await books(req).getNew(4);

        return render(req, res, "index/index", {
            nav: 'index',
            lists: mlists,
            genres: genres_list,
            picked: picked,
            most_popular: mostPopular,
            featured_bestsellers: {best: featured_bestsellers_list, news: new_list}
        });
    }
}

module.exports = IndexController;