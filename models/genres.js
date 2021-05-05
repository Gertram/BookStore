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
    static async getMostNumerous(limit){
        let res = await db.query('SELECT genres.*,(SELECT count(*) FROM books_genres WHERE books_genres.genre_id = genres.genre_id) as quantity FROM genres order by quantity DESC LIMIT ?',[limit])
        return res[0];
    }
}

module.exports = Genres;