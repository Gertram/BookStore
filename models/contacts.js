const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;

class Contacts{
    constructor(db){
        this.db = db;
    }
    contacts(){
        return this.db.collection("contacts");
    }
    async getAll(){
        return this.contacts().find().toArray();
    }
    async add(name,email,question,message){
        return this.contacts().insertOne({name:name,email:email,question:question,message:message});
    }
    async remove(request) {
        return this.contacts().findOneAndDelete({_id: ObjectId(request)});
    }
}

module.exports = function (req) {
    return new Contacts(req.db);
};