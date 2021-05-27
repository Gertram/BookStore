const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;

class Providers{
    static async getAll(){
        return (await this.providers()).find().toArray()
    }
    static async get(provider){
        return (await this.providers()).findOne({_id:ObjectId(provider)});
    }
    static async add(name,phone){
        return (await this.providers()).insertOne({name:name,phone:phone}).ops;
    }
    static async remove(provider_id){
        return (await this.providers()).findAndDelete({_id:ObjectId(provider_id)});
    }
    static async providers(){
        const db = await mongo();
        return db.collection("providers");
    }
}

module.exports = Providers;