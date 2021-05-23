let db = require('../app/db');

class Providers{
    static async getAll(){
        let res = await db.query('SELECT * FROM providers');
        return  res[0];
    }
    static async get(provider){
        let res = await db.query('SELECT * FROM providers WHERE provider_id = ?',[provider]);
        return  res[0];
    }
    static async add(name,phone){
        await db.query('INSERT INTO providers(name,phone) values (?,?)',[name,phone])
    }
    static async remove(provider_id){
        await db.query('DELETE FROM providers where provider_id = ?',[provider_id])
    }
}

module.exports = Providers;