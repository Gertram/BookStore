let db = require('../app/db');

class Basket{
    static async get(user_id){
        let res = await db.query('SELECT * from baskets where user_id = ?',[user_id]);

        return res[0];
    }
    /*static async add(title,description,genres,author_id){
        let res = await db.query('INSERT INTO books(title,description,author_id) values (?,?,?)',[title,description,author_id]);
        console.log(res);
    }*/
}

module.exports = Basket;