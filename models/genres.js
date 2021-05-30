const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;


class Genres{
    constructor(db){
        this.db = db;
    }
    async getAll(){
        return (await this.genres()).find().toArray();
    }
    async add(title,img){
        return (await this.genres()).insertOne({title:title,img:img,views:0});
    }
    async remove(genre_id){
        return (await this.genres()).findOneAndDelete({_id:ObjectId(genre_id)})
    }
    async rename(genre_id,title,img){
        if(img == null){
            return (await this.genres()).findOneAndUpdate({_id:ObjectId(genre_id)},{$set:{title:title}})
        }
        return (await this.genres()).findOneAndUpdate({_id:ObjectId(genre_id)},{$set:{title:title,img:img}})
    }
    async addView(genre_id){
        return (await this.genres()).findOneAndUpdate({_id:ObjectId(genre_id)},{$inc:{views:1}})
    }
    async getMostNumerous(limit){
        return (await this.genres()).find().sort({views:-1}).limit(limit).toArray()
    }
    async genres(){
        return this.db.collection("genres");
    }
}

module.exports = function (req) {
    return new Genres(req.db);
};