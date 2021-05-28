const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;
let books = require('./books')

class UserBasket {
    constructor(user) {
        this.user = user;
    }

    async baskets() {
        return (await mongo()).collection("baskets");
    }

    async products() {
        return (await this.baskets()).aggregate([
            {$match: {_id: this.user}},
            {$unwind: {path: "$products"}},
            {
                $lookup: {
                    from: "books",
                    localField: "products.$id",
                    foreignField: "_id",
                    as: "book"
                }
            }
        ]).toArray();

    }

    async add(product, quantity) {
        var items = (await (await this.baskets()).findOne({_id: this.user})).products;
        items.add(product);
        return (await this.baskets()).findOneAndUpdate({_id: this.user}, {$set: {products: items}});
    }

    async remove(product) {
        var items = (await (await this.baskets()).findOne({_id: this.user}).products).filter(item => {
            return item.id != product;
        });
        return (await this.baskets()).findOneAndUpdate({_id: this.user}, {$set: {products: items}});
    }

    async clear() {
        return (await this.baskets()).findOneAndDelete({_id: this.user})
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
        let books_list = await books.getFilter(products.map(val => val.product));
        return books_list.map(book => {
            book.quantity = products.filter(item => item.product == book.book_id)[0].quantity;
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
    return new UserBasket(req.cookies.user);
}

module.exports = getBasket;