const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;

class Emails{
    constructor(db){
        this.db = db;
    }
    emails(){
        return this.db.collection("emails");
    }
    async getAll(){
        return this.emails().find().toArray();
    }
    async add(email,){
        return this.emails().insertOne({email:email});
    }
    async remove(email) {
        return this.emails().findOneAndDelete({_id: ObjectId(email)});
    }
}

module.exports = function (req) {
    return new Emails(req.db);
};