let db = require('../app/db');

let select_query = 'SELECT books.*,authors.* FROM books,authors where book_id IN (SELECT book_id FROM lists_content where list_id = ?) and authors.author_id = books.author_id';
let add_query = 'INSERT INTO lists_content(list_id,book_id) VALUES (?,?)';
let remove_query = 'DELETE FROM lists_content WHERE list_id = ? and book_id = ?';
class List{
    constructor(list_id){
        this.list_id = list_id;
    }
    async getTitle(){
        let res = await db.query('SELECT title from lists where  list_id = ?',[this.list_id]);
        return res[0];
    }
    async getAll(){
        let res = await db.query(select_query,[this.list_id]);
        return res[0].map(function(val){
            let price = val['price'].toString();
            let left = price.slice(0,-2);
            let right = price.slice(-2);
            val['price'] = [left,right];
            return val;
        });
    }
    async add(book_id){
        let res = await db.query(add_query,[this.list_id,book_id]);
        console.log(res);
    }
    async remove(book_id){
        let res = await db.query(remove_query,[this.list_id,book_id]);
        console.log(res);
    }
}

class Lists{
    static getNewReleases(){
        return new List(1);
    }
    static getComingSoon(){
        return new List(2);
    }
    static getBestSellers(){
        return new List(3);
    }
    static getAwardWinners(){
        return new List(4);
    }
}


module.exports = Lists;