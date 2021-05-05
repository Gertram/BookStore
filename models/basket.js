let db = require('../app/db');

class UserBasket{
    constructor(user){
        this.user = user;
    }
    async products(){
        let res = await db.query('SELECT books.*,baskets.quantity FROM baskets INNER JOIN books ON user_id = ? and books.book_id = baskets.book_id',[this.user])

        return res[0].map(function(val){
            let price = val['price'].toString();
            let left = price.slice(0,-2);
            let right = price.slice(-2);
            val['price'] = [left,right];
            return val;
        });
    }
    async add(product,quantity){
        let res = await db.query('INSERT INTO baskets(user_id,book_id,quantity) VALUES(?,?,?)',[this.user,product,quantity]);
    }
    async remove(product){
        let res = await db.query('DELETE FROM baskets WHERE user_id = ? and book_id = ?',[this.user,product]);
    }
}

class CookieBasket{
    constructor(req,res){
        this.res = res;
        this.req = req;
    }
    async products(){
        let products = this.req.cookies.basket;
        if(products == null){
            return [];
        }
        let books_list = await books.getFilter(products.map(val => val.product));
        return books_list.map(book => {
            book.quantity = products.filter(item => item.product == book.book_id)[0].quantity;
            return book;
        });
    }
    async add(product,quantity){
        let basket = this.req.cookies.basket;
        if(basket == null){
            basket = [];
        }

        basket.push({product: product, quantity: quantity});

        this.res.cookie('basket', basket, {maxAge: 90000000, httpOnly: true, secure: false, overwrite: true});
    }
    async remove(product){
        let basket = this.req.cookies.basket;
        basket = basket.filter(item => {
            return item.product != product;
        });

        this.res.cookie('basket', basket, {maxAge: 90000000, httpOnly: true, secure: false, overwrite: true});
    }
}

function getBasket(req,res){
    if(req.cookies.user == null) {
        return new CookieBasket(req, res)
    }
    return new UserBasket(req.cookies.user);
}

module.exports = getBasket;