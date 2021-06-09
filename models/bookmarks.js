const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;
let books = require('./books')

class UserBookMarks {
    constructor(user, db) {
        this.user = user;
        this.db = db;
    }

    users() {
        return this.db.collection("users");
    }

    async products() {
        let res =  (await (await this.users()).aggregate([
            {$match: {_id: ObjectId(this.user)}},
            {
                $lookup: {
                    from: "books",
                    localField: "bookmarks.book",
                    foreignField: "_id",
                    as: "bookmarks"
                }
            },
        ]).toArray())[0];

        if(res.bookmarks == null){
            return [];
        }

        return res.bookmarks;
    }

    async add(product) {
        let user = await this.users().findOne({_id: ObjectId(this.user)}, {bookmarks: 1});
        let bookmarks = user.bookmarks;
        if (bookmarks == null) {
            bookmarks = []
        }
        const users = this.users()
        for(let i = 0;i < bookmarks.length;i++){
            if (bookmarks[i].book.toString() == product) {
                return;
            }
        }
        return this.users().findOneAndUpdate({_id: ObjectId(this.user)}, {
            $push: {
                bookmarks: {
                    book:ObjectId(product)
                }
            }
        });
    }

    async remove(product) {
        return this.users().findOneAndUpdate({_id: ObjectId(this.user)}, {$pull: {bookmarks: {book: ObjectId(product)}}});
    }

    async clear() {
        return this.users().findOneAndUpdate({_id: ObjectId(this.user)}, {$set: {bookmarks: []}});
    }
}

class CookieBookMarks {
    constructor(req, res) {
        this.res = res;
        this.req = req;
    }

    async products() {
        let products = this.req.cookies.bookmarks;
        if (products == null) {
            return [];
        }
        let books_list = await books(this.req).getFilter(products.map(val => ObjectId(val.product)));
        return books_list.map(book => {
            return book;
        });
    }

    async add(product) {
        let bookmarks = this.req.cookies.bookmarks;
        if (bookmarks == null) {
            bookmarks = [];
        }

        bookmarks.push({product: product});

        this.res.cookie('bookmarks', bookmarks, {maxAge: 90000000, httpOnly: true, secure: false, overwrite: true});
    }

    async remove(product) {
        let bookmarks = this.req.cookies.bookmarks;
        bookmarks = bookmarks.filter(item => {
            return item.product != product;
        });

        this.res.cookie('bookmarks', bookmarks, {maxAge: 90000000, httpOnly: true, secure: false, overwrite: true});
    }
}

function getBookMarks(req, res) {
    if (req.cookies.user == null) {
        return new CookieBookMarks(req, res)
    }
    return new UserBookMarks(req.cookies.user, req.db);
}

module.exports = getBookMarks;