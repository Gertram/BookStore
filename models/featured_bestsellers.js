let db = require('../app/db');

class FeaturedtSelllers{
    static async getAll(){
        let res = await db.query('SELECT * FROM featured_bestsellers');
        return  res[0];
    }
    static async getRandom(){
        let res = await db.query('SELECT * FROM featured_bestsellers INNER JOIN books on featured_bestsellers.book_id = books.book_id inner join authors on authors.author_id = books.author_id ORDER BY RAND() LIMIT 1');
        return res[0]
    }
    static async add(book_id){
        await db.query('INSERT INTO featured_bestsellers(book_id) values (?)',[book_id]);
    }
    static async remove(book_id){
        await db.query('DELETE FROM featured_bestsellers where book_id = ?',[book_id]);
    }

}

module.exports = FeaturedtSelllers;