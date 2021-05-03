let db = require('../app/db');

class Books{
    static async getAll(){
        let res = await db.query('SELECT * FROM books');
        return res[0].map(function(val){
            let price = val['price'].toString();
            let left = price.slice(0,-2);
            let right = price.slice(-2);
            val['price'] = [left,right];
            return val;
        });
    }
    static async add(title,description,genres,author_id){
        let res = await db.query('INSERT INTO books(title,description,author_id) values (?,?,?)',[title,description,author_id]);
        console.log(res);
    }
}

module.exports = Books;