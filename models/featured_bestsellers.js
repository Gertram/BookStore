const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;

class FeaturedtSelllers {
    static async bestsellers() {
        return (await mongo()).collection("featured_bestsellers");
    }

    static async getAll() {
        let books = await (await this.bestsellers()).aggregate([
            {$unwind: {path: "$info"}},
            {
                $lookup: {
                    from: "books",
                    localField: "info.$id",
                    foreignField: "_id",
                    as: "info"
                }
            },
            {$unwind: {path: "$info"}},
            {
                $lookup: {
                    from: "authors",
                    localField: "info.authors.$id",
                    foreignField: "_id",
                    as: "info.authors"
                }
            },
            {
                $lookup: {
                    from: "genres",
                    localField: "info.genres.$id",
                    foreignField: "_id",
                    as: "info.genres"
                }
            },
        ]).toArray();

        books = books.map(item => item.info)

        console.log(books);

        return books;
    }

    static async getRandom() {
        const book = await (await this.bestsellers()).aggregate([
            {$sample: {size: 1}},
            {$unwind: {path: "$info"}},
            {
                $lookup: {
                    from: "books",
                    localField: "info.$id",
                    foreignField: "_id",
                    as: "book"
                }
            },
        ]).toArray();

        return book[0].book[0];
    }

    static async add(book_id) {
        return (await (await this.bestsellers()).insertOne({
            info: {
                $ref: "books",
                $id: ObjectId(book_id),
                $db: "BookStore"
            }
        })).ops[0];
    }

    static async remove(book_id) {
        return (await this.bestsellers()).findOneAndDelete({_id: ObjectId(book_id)});
    }

}

module.exports = FeaturedtSelllers;