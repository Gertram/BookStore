const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;

class Users{
    static async getAll(){
        const users = await this.users();

        let res = await users.find().toArray();

        return res;
    }
    static async users(){
        const db = await mongo();
        return db.collection("users");
    }
    static async login(login,password){
        const users = await this.users();

        let res = await users.findOne({$and:[{$or:[{email:login},{username:login}]},{password:password}]});

        return res
    }
    static async create(email,password,username,role){
        const users = await this.users();

        let res = await users.insertOne({username:username,email:email,password:password,role:role});

        return res.ops[0];
    }
    static async get(user){
        const users = await this.users();

        let res = await users.findOne({_id:ObjectId(user)});
        return res;
    }
    static async save(user,email,user_name,phone){
        const users = await this.users();

        let res = await users.findOneAndUpdate({_id:ObjectId(user)},{$set:{username:user_name,email:email,phone:phone}});
        return res.ops;
    }
    static async save_password(user,password){
        const users = await this.users();

        let res = await users.findOneAndUpdate({_id:ObjectId(user)},{$set:{password:password}});
        return res.ops;
    }
}

module.exports = Users;