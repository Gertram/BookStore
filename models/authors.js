const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;


class Authors{
    constructor(db){
        this.db = db;
    }
       async authors(){
        return this.db.collection("authors");
    }
   async getAll(){
        return (await this.authors()).find().toArray();
    }
   async get(author){
        return (await this.authors()).findOne({_id:author});
    }
   async add(firstname,lastname,img){
        return (await this.authors()).insertOne({firstname:firstname,lastname:lastname,author_img:img,views:0})
    }
   async addView(author){
        return (await this.authors()).findOneAndUpdate({_id:ObjectId(author)},{$inc:{views:1}})
    }
   async redact(author_id,firstname,lastname,img = null){
        if(img != null) {
            return (await this.authors()).findOneAndUpdate({_id:ObjectId(author_id)},{$set:{firstname:firstname,lastname:lastname,author_img:img}})
        } else {
            return (await this.authors()).findOneAndUpdate({_id:ObjectId(author_id)},{$set:{firstname:firstname,lastname:lastname}})
        }
    }
   async getMostPopular(limit){
        return (await this.authors()).find().sort({views:-1}).limit(limit).toArray()
    }
   async remove(author_id){
        return (await this.authors()).findOneAndDelete({_id:author_id});
    }

}

module.exports = function(req){
    return new Authors(req.db);
};