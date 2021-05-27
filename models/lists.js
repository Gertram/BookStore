const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;

class List{
    constructor(list_id){
        this.list_id = list_id;
    }
    async list(){
        return (await mongo()).collection(this.list_id);
    }
    async getAll(){
        return (await this.list()).find().toArray();
    }
    async add(book_id){
        return (await this.list()).insertOne({"$ref":"books","$id":ObjectId(book_id),"$db":"BookStore"}).ops;
    }
    async remove(book_id){
        return (await this.list()).findOneAndDelete({})
    }

}

class Lists{
    static getNewReleases(){
        return new List("NewReleases");
    }
    static getComingSoon(){
        return new List("ComingSoon");
    }
    static getBestSellers(){
        return new List("BestSellers");
    }
    static getAwardWinners(){
        return new List("AwardWinners");
    }
}


module.exports = Lists;