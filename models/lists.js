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
        let promise1 = db.query(`SELECT books.* from lists_content inner join books on lists_content.list_id = ? and lists_content.book_id = books.book_id`,[this.list_id]);
        let promise2 = db.query(`SELECT authors.*,books_authors.book_id from lists_content inner join books_authors on lists_content.list_id = ? and lists_content.book_id = books_authors.book_id inner join authors on books_authors.author_id = authors.author_id`,[this.list_id])

        let res = await Promise.all([promise1,promise2])


        let res1 = res[0][0];
        let res2 = res[1][0];

        res1 = res1.map(val=>{
            res2.forEach(item=>{
                if(item.book_id == val.book_id){
                    if(val.authors == null){
                        val.authors = [];
                    }
                    val.authors.push(item);
                }
            })
            return val;
        })

        return res1;
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