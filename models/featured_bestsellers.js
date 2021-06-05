const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;

class FeaturedtSelllers {
    constructor(db){
        this.db = db;
    }
    books() {
        return this.db.collection("books");
    }

    async getAll() {
        return this.books().find({featured_bestsellers: 1}).toArray()
    }

    async getRandom() {
        const books = await this.books().aggregate([
            {$match:{featured_bestsellers:1}},
            {$sample: {size: 1}},
            {
                $lookup: {
                    from: "authors",
                    localField: "authors.$id",
                    foreignField: "_id",
                    as: "authors"
                }
            },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "book.id",
                    as: "reviews"
                }
            }
        ]).toArray();

        if(books.length == 0){
            return null;
        }

        books.map(item => {
            item.raiting = item.reviews.reduce(((acc,cur) => acc + cur.raiting),null)
            return item;
        })

        return books[0];
    }

    async add(book_id) {
        return this.books().findOneAndUpdate({_id:ObjectId(book_id)},{$set:{featured_bestsellers:1}});
    }

    async remove(book_id) {
        return (await this.books()).findOneAndUpdate({_id: ObjectId(book_id)},{$set:{featured_bestsellers:null}});
    }

}

module.exports = function (req) {
    return new FeaturedtSelllers(req.db);
};