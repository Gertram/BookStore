const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;
let books = require('./books')

class UserBasket {
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
                    localField: "basket.book",
                    foreignField: "_id",
                    as: "books"
                }
            },
        ]).toArray())[0];

        if(res.basket == null){
            return [];
        }

        for(let i = 0;i < res.basket.length;i++){
            res.basket[i].book = res.books[i];
        }

        return res.basket;
    }

    async add(product, quantity) {
        let user = await this.users().findOne({_id: ObjectId(this.user)}, {basket: 1});
        let basket = user.basket;
        if (basket == null) {
            basket = []
        }
        const users = this.users()
        for(let i = 0;i < basket.length;i++){
            if (basket[i].book.toString() == product) {
                basket[i].quantity += parseInt(quantity);
                return users.findOneAndUpdate({_id: ObjectId(this.user)}, {$set: {basket: basket}});
            }
        }
        return this.users().findOneAndUpdate({_id: ObjectId(this.user)}, {
            $push: {
                basket: {
                    book:ObjectId(product), quantity: parseInt(quantity)
                }
            }
        });
    }

    async remove(product) {
        return this.users().findOneAndUpdate({_id: ObjectId(this.user)}, {$pull: {basket: {book: ObjectId(product)}}});
    }

    async clear() {
        return this.users().findOneAndUpdate({_id: ObjectId(this.user)}, {$set: {basket: []}});
    }
}

class CookieBasket {
    constructor(req, res) {
        this.res = res;
        this.req = req;
    }

    async products() {
        let products = this.req.cookies.basket;
        if (products == null) {
            return [];
        }
        let books_list = await books(this.req).getFilter(products.map(val => ObjectId(val.product)));
        return books_list.map(book => {
            book = {book:book};
            book.quantity = products.filter(item => item.product == book.book._id)[0].quantity;
            return book;
        });
    }

    async add(product, quantity) {
        let basket = this.req.cookies.basket;
        if (basket == null) {
            basket = [];
        }

        basket.push({product: product, quantity: quantity});

        this.res.cookie('basket', basket, {maxAge: 90000000, httpOnly: true, secure: false, overwrite: true});
    }

    async remove(product) {
        let basket = this.req.cookies.basket;
        basket = basket.filter(item => {
            return item.product != product;
        });

        this.res.cookie('basket', basket, {maxAge: 90000000, httpOnly: true, secure: false, overwrite: true});
    }

    async clear() {
        this.res.cookie('basket', null, {maxAge: 0});
    }
}

function getBasket(req, res) {
    if (req.cookies.user == null) {
        return new CookieBasket(req, res)
    }
    return new UserBasket(req.cookies.user, req.db);
}

module.exports = getBasket;