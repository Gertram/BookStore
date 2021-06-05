const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;


class Reviews {
    constructor(db) {
        this.db = db;
    }

    async reviews() {
        return this.db.collection("reviews");
    }

    async getAll() {
        return (await this.reviews()).find().toArray();
    }

    async get(review_id) {
        let res = await (await this.reviews()).aggregate([
            {$match:{_id:ObjectId(review_id)}},
            {
                $lookup: {
                    from: "books",
                    localField: "book.id",
                    foreignField: "_id",
                    as: "book"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user.id",
                    foreignField: "_id",
                    as: "user"
                }
            }

        ]).toArray();

        if(res.length == 0){
            return null;
        }

        res = res.map(item => {
            item.book = item.book[0];
            item.user = item.user[0];
            return item;
        })

        return res[0];
    }

    async approve(review_id, employee_id) {
        return (await this.reviews()).findOneAndUpdate({_id: ObjectId(review_id)}, {
            $set: {
                status: 2,
                employee: {id: ObjectId(employee_id)}
            }
        });
    }

    async reject(review_id, employee_id, cause) {
        return (await this.reviews()).findOneAndUpdate({_id: ObjectId(review_id)}, {
            $set: {
                status: 3,
                employee: {id: ObjectId(employee_id)},
                cause:cause
            }
        });
    }

    async getAllWithBook() {
        let res = await (await this.reviews()).aggregate([

            {
                $lookup: {
                    from: "books",
                    localField: "book.id",
                    foreignField: "_id",
                    as: "book"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user.id",
                    foreignField: "_id",
                    as: "user"
                }
            }

        ]).toArray();

        res = res.map(item => {
            item.book = item.book[0];
            item.user = item.user[0];
            return item;
        })

        return res;
    }

    async getAllForBook(book_id) {
        return (await this.reviews()).aggregate([
            {
                $lookup: {
                    from: "books",
                    localField: "book.id",
                    foreignField: "_id",
                    as: "book"
                }
            },
            {$match: {books: {_id: book_id}}}
        ]).toArray();
    }

    async add(user_id, book_id, raiting, comment) {
        return (await this.reviews()).insertOne({
            raiting: raiting,
            text: comment,
            status: 1,
            employee: {id: null},
            user: {id: ObjectId(user_id)},
            book: {id: ObjectId(book_id)}
        });
    }

    async remove(review_id) {
        return (await this.reviews()).findOneAndDelete({_id: ObjectId(review_id)});
    }
}

module.exports = function (req) {
    return new Reviews(req.db);
};