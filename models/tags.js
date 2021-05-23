let db = require('../app/db');

class Tags{
    static async getAll(){
        let res = await db.query('SELECT * FROM tags');
        return  res[0];
    }
    static async add(title){
        await db.query('INSERT INTO tags(title) values (?)',[title]);
    }
    static async remove(tag_id){
        await db.query('DELETE FROM tags where tag_id = ?',[tag_id])
    }
    static async rename(tag_id,title){
        await db.query('UPDATE tags set title = ? where tag_id = ?',[title,tag_id]);
    }
}

module.exports = Tags;