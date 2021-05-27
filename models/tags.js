const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;

class Tags{
    static async getAll(){
        return (await this.tags()).find().toArray();
    }
    static async add(title){
        return (await this.tags()).insertOne({title:title});
    }
    static async remove(tag_id){
        return (await this.tags()).findOneAndDelete({_id:ObjectId(tag_id)})
    }
    static async rename(tag_id,title){
        return (await this.tags()).findOneAndUpdate({_id:ObjectId(tag_id)},{$set:{title:title}})
    }
    static async tags(){
        const db = await mongo();
        return db.collection("tags");
    }
}

module.exports = Tags;