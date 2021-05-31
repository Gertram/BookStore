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
        return await (await this.books()).find({"lists.list": this.list_id}).toArray();
    }

    async add(book_id) {
        return (await this.books()).findOneAndUpdate({_id: ObjectId(book_id)}, {$push: {lists: {list: this.list_id}}});
    }

    async remove(book_id) {
        return (await this.books()).findOneAndUpdate({_id: ObjectId(book_id)}, {$pull: {lists: {list: this.list_id}}});
    }

}

class Lists {
    constructor(db){
        this.db = db;
    }
   getNewReleases() {
        return new List("1",this.db);
    }

   getComingSoon() {
        return new List("2",this.db);
    }

   getBestSellers() {
        return new List("3",this.db);
    }

   getAwardWinners() {
        return new List("4",this.db);
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