const lists = require('../../models/lists');
const books = require('../../models/books');
const render = require('../../app/render');

class ListsController{
    static async index (req, res, next) {
        let mlists = await lists.Lists(req).getAll();

        return render(req,res,'admin/lists', {
            lists:mlists
        })
    }
    static async remove (req, res, next) {
        let list = lists.List(req.params.list_id,req);
        const book_id = req.body.book_id;

        await list.remove(book_id);

        res.redirect('back');
    }
    static async add (req, res, next) {
        let list = lists.List(req.body.list_id,req);
        const book_id = req.body.book_id;

        let books_list = await list.getAll();

        if(books_list.length === 4){
            return res.send("Список полон");
        }

        books_list = books_list.map(item => item._id.toString());

        for(let i = 0;i < books_list.length;i++){
            if(book_id == books_list[i]){
                return res.send("Книга уже в списке");
            }
        }

        await list.add(book_id);

        res.redirect('back');
    }
}

module.exports = ListsController;