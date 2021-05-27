const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;


class Authors{
    static async authors(){
        return (await mongo()).collection("authors");
    }
    static async getAll(){
        return (await this.authors()).find().toArray();
    }
    static async get(author){
        return (await this.authors()).findOne({_id:author});
    }
    static async add(firstname,lastname,img){
        return (await this.authors()).insertOne({firstname:firstname,lastname:lastname,author_img:img,views:0})
    }
    static async addView(author){
        return (await this.authors()).findOneAndUpdate({_id:ObjectId(author)},{$inc:{views:1}})
    }
    static async redact(author_id,firstname,lastname,img = null){
        if(img != null) {
            return (await this.authors()).findOneAndUpdate({_id:ObjectId(author_id)},{$set:{firstname:firstname,lastname:lastname,author_img:img}})
        } else {
            return (await this.authors()).findOneAndUpdate({_id:ObjectId(author_id)},{$set:{firstname:firstname,lastname:lastname}})
        }
    }
    static async getMostPopular(limit){
        return (await this.authors()).find().sort({views:-1}).limit(limit).toArray()
    }
    static async remove(author_id){
        return (await this.authors()).findOneAndDelete({_id:author_id});
    }

}

module.exports = Authors;