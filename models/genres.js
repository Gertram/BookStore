const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;


class Genres{
    static async getAll(){
        return (await this.genres()).find().toArray();
    }
    static async add(title,img){
        return (await this.genres()).insertOne({title:title,img:img,views:0});
    }
    static async remove(genre_id){
        return (await this.genres()).findOneAndDelete({_id:ObjectId(genre_id)})
    }
    static async rename(genre_id,title,img){
        if(img == null){
            return (await this.genres()).findOneAndUpdate({_id:ObjectId(genre_id)},{$set:{title:title}})
        }
        return (await this.genres()).findOneAndUpdate({_id:ObjectId(genre_id)},{$set:{title:title,img:img}})
    }
    static async addView(genre_id){
        return (await this.genres()).findOneAndUpdate({_id:ObjectId(genre_id)},{$inc:{views:1}})
    }
    static async getMostNumerous(limit){
        return (await this.genres()).find().sort({views:-1}).limit(limit).toArray()
    }
    static async genres(){
        const db = await mongo();
        return db.collection("genres");
    }
}

module.exports = Genres;