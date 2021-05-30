const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;

class Providers{
    constructor(db){
        this.db = db;
    }
    async getAll(){
        return (await this.providers()).find().toArray()
    }
    async get(provider){
        return (await this.providers()).findOne({_id:ObjectId(provider)});
    }
    async add(name,phone){
        return (await this.providers()).insertOne({name:name,phone:phone}).ops;
    }
    async remove(provider_id){
        return (await this.providers()).findAndDelete({_id:ObjectId(provider_id)});
    }
    async providers(){
        return this.db.collection("providers");
    }
}

module.exports = function (req) {
    return new Providers(req.db);
};