let db = require('../app/db');

class Users{
    /*static async getAll(){
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
    }*/
    static async login(login,password){
        let res = await db.query("SELECT user_id from users where (email = ? or username = ?) and password = ?",[login,login,password])
        return res[0]
    }
    static async create(email,password,username){
        try {
            let res = await db.query("INSERT into users(email,password,username) VALUES(?,?,?)", [email, password, username]);
        }catch (err) {
            if(err.errno = 1062){
                return 'duplicate';
            }
        }

        let res = await db.query("SELECT user_id from users where email = ? and username = ?",[email,username]);

        return res[0]
    }
}

module.exports = Users;