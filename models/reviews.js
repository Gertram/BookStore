let db = require('../app/db');

class Reviews{
    static async getAll(){
        let res = await db.query('SELECT * FROM reviews INNER JOIN users on users.user_id = reviews.user_id');
        return  res[0];
    }
    static async get(review_id){
        let res = await db.query('SELECT reviews.*,users.user_id,users.username,books.title FROM reviews INNER JOIN users on users.user_id = reviews.user_id inner JOIN books on reviews.book_id = books.book_id where review_id = ?',[review_id]);
        return  res[0];
    }
    static async approve(review_id,employee_id){
        await db.query('UPDATE reviews SET status = 3,employee_id = ? where review_id = ?',[employee_id,review_id]);
    }
    static async reject(review_id,employee_id,cause){
        await db.query('UPDATE reviews SET status = 2,employee_id = ?,cause = ? where review_id = ?',[employee_id,review_id,cause]);
    }
    static async getAllWithBook(){
        let res = await db.query('SELECT reviews.*,users.user_id,users.username,books.title FROM reviews INNER JOIN users on users.user_id = reviews.user_id inner JOIN books on reviews.book_id = books.book_id');
        return  res[0];
    }
    static async getAllForBook(book_id){
        let res = await db.query('SELECT reviews.*,users.user_id,users.username,books.title FROM reviews INNER JOIN users on users.user_id = reviews.user_id inner JOIN books on books.book_id = ? where reviews.book_id = ?',[book_id,book_id]);
        return  res[0];
    }
    static async add(user_id,book_id,raiting,comment){
        console.log(`INSERT INTO reviews(user_id,book_id,raiting,text) values (${user_id},${book_id},${raiting},'${comment}')`);
        await db.query(`INSERT INTO reviews(user_id,book_id,raiting,text) values (${user_id},${book_id},${raiting},'${comment}')`);
    }
    static async remove(user_id,book_id){
        await db.query('DELETE FROM reviews where book_id = ? and user_id',[book_id,user_id]);
    }
}

module.exports = Reviews;