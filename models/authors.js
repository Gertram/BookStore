let db = require('../app/db');

class Authors{
    static async getAll(){
        let res = await db.query('SELECT * FROM authors');
        return  res[0];
    }
    static async add(firstname,lastname){
        db.query('INSERT INTO authors(firstname,lastname) values (?,?)',[firstname,lastname]).catch(err => {
            console.log(err);
        });
    }
    static async remove(author_id){
        db.query('DELETE FROM authors where author_id = ?',[author_id]).catch(err => {
            console.log(err);
        });
    }

}

module.exports = Authors;