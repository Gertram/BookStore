const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;

class Tags{
    constructor(db){
        this.db = db;
    }
    async getAll(){
        return (await this.tags()).find().toArray();
    }
    async add(title){
        return (await this.tags()).insertOne({title:title});
    }
    async remove(tag_id){
        return (await this.tags()).findOneAndDelete({_id:ObjectId(tag_id)})
    }
    async rename(tag_id,title){
        return (await this.tags()).findOneAndUpdate({_id:ObjectId(tag_id)},{$set:{title:title}})
    }
    async tags(){
        return this.db.collection("tags");
    }
}

module.exports = function (req) {
    return new Tags(req.db);
};