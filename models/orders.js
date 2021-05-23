let db = require('../app/db');
var dateFormat = require('dateformat');

class Orders{
    static async getAll(filter){
        let res = await db.query('SELECT * FROM orders where order_id in (?)',[filter])
        return res[0];
    }
    static async getUser(user){
        let res = await db.query('SELECT * FROM orders where customer_id = ?',[user])
        return res[0];
    }
    /*static async add(firstname,lastname){
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

        let res2 = await db.query("SELECT * FROM order_product INNER JOIN books on  order_id = ? and books.book_id = order_product.product_id",[order]);

        res = res[0][0];

        if(res != undefined)
            res.products = res2[0];
        return res;
    }

    static async add(products,address,customer){
        let date = dateFormat(new Date(), "yyyy-mm-dd")

        const books = products.map(product => product.book_id).join(',');

        let trans = db.startTransaction();

        try {
            const promise1 = trans.query('INSERT INTO orders(order_date,address,customer_id) values(?,?,?)', [date, address, customer]);
            const promise2 = trans.query(`SELECT COALESCE((SELECT SUM(count) FROM delivery_product where product_id = book_id),0) - COALESCE((SELECT SUM(quantity) FROM order_product where product_id = book_id),0) as quantity,book_id FROM books where book_id in (${books})`);

            const res = await Promise.all(promise1,promise2);

            const order_id = res[0][0].insertId;

            const counts = res[1][0];

            let values = [];

            products.forEach(product => {
                counts.forEach(item =>{
                   if(item.book_id == product.book_id && item.quantity < product.quantity){
                        trans.rollback();
                        trans.execute();
                        return {status:false,product:item.book_id};
                   }
                });
                values.push(`(${order_id},${product.book_id},${product.price[0]}${product.price[1]},${product.quantity})`)
            });

            values = values.join(',');

            console.log(values)

            res = await trans.query(`INSERT INTO order_product(order_id,product_id,price,quantity) VALUES ${values};`);

            trans.commit();

        }catch (err) {
            trans.rollback();
            console.log(err);
            trans.execute();
            return {status:false};
        }

        trans.execute();

        return {status:true,order_id:order_id};
    }
}

module.exports = Orders;