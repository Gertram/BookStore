var ObjectId = require('mongodb').ObjectID;

class Users{
    constructor(db){
        this.db = db;
    }
    async getAll(){
        const users = await this.users();

        let res = await users.find().toArray();

        return res;
    }
    async users(){
        return this.db.collection("users");
    }
    async login(login,password){
        const users = await this.users();

        let res = await users.findOne({$and:[{$or:[{email:login},{username:login}]},{password:password}]});

        return res
    }
    async create(email,password,username,role){
        const users = await this.users();

        let res = await users.insertOne({username:username,email:email,password:password,role:role});

        return res.ops[0];
    }
    async get(user){
        const users = await this.users();

        let res = await users.findOne({_id:ObjectId(user)});

        return res;
    }
    async save(user,email,user_name,phone){
        const users = await this.users();

        let res = await users.findOneAndUpdate({_id:ObjectId(user)},{$set:{username:user_name,email:email,phone:phone}});
        return res.ops;
    }
    async save_password(user,password){
        const users = await this.users();

        let res = await users.findOneAndUpdate({_id:ObjectId(user)},{$set:{password:password}});
        return res.ops;
    }
}

module.exports = function(req){
    return new Users(req.db);
};