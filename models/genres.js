let db = require('../app/db');

class Genres{
    static async getAll(){
        let res = await db.query('SELECT * FROM genres');
        return  res[0];
    }
    static async add(title,img){
        await db.query('INSERT INTO genres(title,img) values (?,?)',[title,img])
    }
    static async remove(genre_id){
        await db.query('DELETE FROM genres where genre_id = ?',[genre_id])
    }
    static async rename(genre_id,title,img){
        if(img == null)
        await db.query('UPDATE genres set title = ? where genre_id = ?',[title,genre_id]);
        else{
            await db.query('UPDATE genres set title = ?,img = ? where genre_id = ?',[title,genre_id,img]);
        }
    }
    static async getMostNumerous(limit){
        let res = await db.query('SELECT genres.*,(SELECT count(*) FROM books_genres WHERE books_genres.genre_id = genres.genre_id) as quantity FROM genres order by quantity DESC LIMIT ?',[limit])
        return res[0];
    }
}

module.exports = Genres;