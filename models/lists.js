const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;

class List {
    constructor(list_id) {
        this.list_id = list_id;
    }

    async books() {
        return (await mongo()).collection("books");
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
    static getNewReleases() {
        return new List("1");
    }

    static getComingSoon() {
        return new List("2");
    }

    static getBestSellers() {
        return new List("3");
    }

    static getAwardWinners() {
        return new List("4");
    }
}

module.exports = {
    Lists: Lists,
    List: List
};