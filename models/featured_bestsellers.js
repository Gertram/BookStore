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
            /*{$unwind: {path: "$book"}},
            {
                $lookup: {
                    from: "authors",
                    localField: "book.authors.$id",
                    foreignField: "_id",
                    as: "book.authors"
                }
            },*/
        ]).toArray();
        console.log(book);
        /*let res = await db.query(`SELECT * FROM featured_bestsellers INNER JOIN books on featured_bestsellers.book_id = books.book_id ORDER BY RAND() LIMIT 1`);
        let res2 = await db.query('SELECT authors.* from  books_authors inner join authors on books_authors.book_id = ? and authors.author_id = books_authors.author_id', [res[0][0].book_id])
        res[0][0].authors = res2[0]
        return res[0]*/
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