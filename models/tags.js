let db = require('../app/db');

class Tags{
    static async getAll(){
        let res = await db.query('SELECT * FROM tags');
        return  res[0];
    }
    static async add(title){
        db.query('INSERT INTO tags(title) values (?)',[title]).catch(err => {
            console.log(err);
        });
    }
    static async remove(genre_id){
        db.query('DELETE FROM tags where tag_id = ?',[genre_id]).catch(err => {
            console.log(err);
        });
    }

}

module.exports = Tags;