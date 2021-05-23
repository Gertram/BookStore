let mongo = require('../app/mongo');

class Users{
    static async getAll(){

        let res = await db.query('SELECT * FROM users');

        return res[0];
    }
    static async login(login,password){
        let res = await db.query("SELECT user_id from users where (email = ? or username = ?) and password = ?",[login,login,password])
        return res[0]
    }
    static async create(email,password,username,role){
        try {
            let res = await db.query("INSERT into users(email,password,username,role) VALUES(?,?,?,?)", [email, password, username,role]);
        }catch (err) {
            if(err.errno = 1062){
                return 'duplicate';
            }
        }

        let res = await db.query("SELECT user_id from users where email = ? and username = ?",[email,username]);

        return res[0]
    }
    static async get(user){
        let res = await db.query('SELECT * FROM users where user_id = ?',[user]);
        return res[0];
    }
    static async save(user,email,user_name,phone){
        let res = await db.query('UPDATE users SET email = ?,username = ?,phone = ? where user_id = ?',[email,user_name,phone,user]);
    }
    static async save_password(user,password){
        let res = await db.query('UPDATE users SET password = ? where user_id = ?',[password,user]);
    }
}

module.exports = Users;