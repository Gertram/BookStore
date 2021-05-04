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

module.exports = UserBasket;