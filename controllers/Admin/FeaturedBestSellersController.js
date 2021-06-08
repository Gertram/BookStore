const featured_bestsellers = require('../../models/featured_bestsellers');
const books = require('../../models/books');
const render = require('../../app/render');

class FeaturedBestSellersController{
    static async index (req, res, next) {
        const list = await featured_bestsellers(req).getAll();
        return render(req,res,'admin/featured_bestsellers/index', {
            books:list
        })
    }
    static async getAdd (req, res, next) {
        let list = await featured_bestsellers(req).getAll();
        let books_list = await books(req).getAll();
        books_list = books_list.filter(item => {
            for(let i = 0;i < list.length;i++){
                let book = list[i];
                if(book._id.toString() == item._id.toString()){
                    return false;
                }
            }
            return true;
        });
        return render(req,res,'admin/featured_bestsellers/add',{
            books:books_list
        });
    }
    static async remove (req, res, next) {
        await featured_bestsellers(req).remove(req.body.book_id);

        res.redirect('/admin/featured_bestsellers');
    }
    static async add (req, res, next) {
        await featured_bestsellers(req).add(req.body.book_id);

        res.redirect('/admin/featured_bestsellers');
    }
}

module.exports = FeaturedBestSellersController;