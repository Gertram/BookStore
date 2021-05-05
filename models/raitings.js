let db = require('../app/db');

class Raitings{
    static async getAll(){
        let res = await db.query('SELECT * FROM raitings inner join users on users.user_id = raitings.user_id');
        return  res[0];
    }
    static async add(user_id,book_id,raiting){
        await db.query('INSERT INTO raitings(user_id,book_id,raiting) values (?,?,?)',[user_id,book_id,raiting]);
    }
    static async remove(user_id,book_id){
        await db.query('DELETE FROM raitings where book_id = ? and user_id',[book_id,user_id]);
    }
}

module.exports = Raitings;