let db = require('../app/db');

class Genres{
    static async getAll(){
        let res = await db.query('SELECT * FROM genres');
        return  res[0];
    }
    static async add(title){
        db.query('INSERT INTO genres(title) values (?)',[title]).catch(err => {
            console.log(err);
        });
    }
    static async remove(genre_id){
        db.query('DELETE FROM genres where genre_id = ?',[genre_id]).catch(err => {
            console.log(err);
        });
    }

}

module.exports = Genres;