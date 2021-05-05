let db = require('../app/db');

class Authors{
    static async getAll(){
        let res = await db.query('SELECT * FROM authors');
        return  res[0];
    }
    static async add(firstname,lastname,img){
        await db.query('INSERT INTO authors(firstname,lastname,img) values (?,?)',[firstname,lastname,img]);
    }
    static async getMostPopular(limit){
        let res = await db.query('SELECT *,(SELECT count(*) From order_product where product_id in (SELECT book_id FROM books where books.author_id = authors.author_id)) as quantity FROM authors ORDER BY quantity DESC LIMIT ?',[limit])
        return res[0]
    }
    static async remove(author_id){
        await db.query('DELETE FROM authors where author_id = ?',[author_id]);
    }

}

module.exports = Authors;