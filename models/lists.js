const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;

class List {
    constructor(list_id,db) {
        this.list_id = list_id;
        this.db = db;
    }

    async books() {
        return this.db.collection("books");
    }

    async getAll() {
        return await (await this.books()).find({"lists.list": ObjectId(this.list_id)}).toArray();
    }

    async add(book_id) {
        return (await this.books()).findOneAndUpdate({_id: ObjectId(book_id)}, {$push: {lists: {list: ObjectId(this.list_id)}}});
    }

    async remove(book_id) {
        return (await this.books()).findOneAndUpdate({_id: ObjectId(book_id)}, {$pull: {lists: {list: ObjectId(this.list_id)}}});
    }
}

class Lists {
    constructor(db){
        this.db = db;
    }
    async getList(){
        return this.db.collection("lists").find().toArray();
    }
    async getAll(){
        return await this.db.collection("lists").aggregate([
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "lists.list",
                    as: "books"
                }
            }]).toArray()
    }
}

module.exports = {
    Lists: function (req) {
        return new Lists(req.db);
    },
    List: function (id,req) {
        return new List(id,req.db);
    }
};