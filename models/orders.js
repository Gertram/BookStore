let db = require('../app/db');
var dateFormat = require('dateformat');

class Orders{
    /*static async getAll(){
        let res = await db.query('SELECT * FROM authors');
        return  res[0];
    }
    static async add(firstname,lastname){
        db.query('INSERT INTO authors(firstname,lastname) values (?,?)',[firstname,lastname]).catch(err => {
            console.log(err);
        });
    }
    static async remove(author_id){
        db.query('DELETE FROM authors where author_id = ?',[author_id]).catch(err => {
            console.log(err);
        });
    }*/

    static async get(order){
        let res = await db.query("SELECT * FROM orders WHERE order_id = ?",[order]);

        let res2 = await db.query("SELECT * FROM order_product where order_id = ?",[order]);

        res2 = res2[0].map(function(val){
            let price = val['price'].toString();
            let left = price.slice(0,-2);
            let right = price.slice(-2);
            val['price'] = [left,right];
            return val;
        });

        res = res[0][0];
        
        res.products = res2;
        return res;
    }

    static async add(products,address,customer){
        let date = dateFormat(new Date(), "yyyy-mm-dd")

        let res = await db.query('INSERT INTO orders(order_date,address,customer_id) values(?,?,?)',[date,address,customer])

        let values = [];

        let order_id = res[0].insertId;

        products.forEach(product => {
            values.push(`(${order_id},${product.book_id},${product.price[0]}${product.price[1]},${product.quantity})`)
        });

        values = values.join(',');

        console.log(values)

        res = await db.query(`INSERT INTO order_product(order_id,product_id,price,quantity) VALUES ${values};`);

        return order_id;
    }
}

module.exports = Orders;