let db = require('../app/db');


class Authors{
    static async getAll(){
        let res = await db.query('SELECT * FROM authors');
        return  res[0];
    }
    static async get(author){
        let res = await db.query('SELECT * FROM authors where author_id = ?',[author]);
        return  res[0][0];
    }
    static async add(firstname,lastname,img){
        await db.query('INSERT INTO authors(firstname,lastname,author_img) values (?,?,?)',[firstname,lastname,img]);
    }
    static async redact(author_id,firstname,lastname,img = null){
        if(img != null) {
            await db.query('UPDATE authors SET firstname = ?,lastname = ?,author_img = ? where author_id = ?', [firstname, lastname, img,author_id]);
        } else {
            await db.query('UPDATE authors SET firstname = ?,lastname = ? where author_id = ?', [firstname, lastname, author_id]);
        }
    }
    static async getMostPopular(limit){
        let res = await db.query(`SELECT *,(SELECT count(*) From order_product where product_id in (SELECT book_id FROM books_authors where books_authors.author_id = authors.author_id)) as quantity FROM authors ORDER BY quantity DESC LIMIT ?`,[limit])
        return res[0]
    }
    static async remove(author_id){
        await db.query('DELETE FROM authors where author_id = ?',[author_id]);
    }

}

module.exports = Authors;