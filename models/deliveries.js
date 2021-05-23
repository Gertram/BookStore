let db = require('../app/db');
var dateFormat = require('dateformat');

class Deliveries{
    static async getAll(){
        let res = await db.query('SELECT * FROM deliveries inner join providers on deliveries.provider_id = providers.provider_id');
        return  res[0];
    }
    static async get(delivery){
        let res = await db.query('SELECT deliveries.*,users.username FROM deliveries INNER JOIN users on delivery_id = ? and users.user_id = deliveries.receiver_id',[delivery]);

        let res2 = await db.query("SELECT * FROM delivery_product INNER JOIN books on  delivery_id = ? and books.book_id = delivery_product.product_id",[delivery]);

        res = res[0][0];

        if(res != undefined)
            res.products = res2[0];
        return res;
    }
    static async add(delivery_id,product_id,count,cover_type){
        let res = await db.query('INSERT INTO delivery_product(delivery_id,product_id,count,cover_type) VALUES(?,?,?,?)',[delivery_id,product_id,count,cover_type]);
    }
    static async open(provider_id,receiver_id){

        let date = dateFormat(new Date(), "yyyy-mm-dd")

        console.log(date);

        let res = await db.query('INSERT INTO deliveries(provider_id,delivery_date,receiver_id,status) values (?,?,?,1)',[provider_id,date,receiver_id])

        let values = [];

        return res[0].insertId;

        /*products.forEach(product => {
            values.push(`(${delivery_id},${product.product_id},${product.count},${product.cover_type})`)
        });

        values = values.join(',');

        console.log(values)

        res = await db.query(`INSERT INTO delivery_product(delivery_id,product_id,count,cover_type) VALUES ${values};`);*/

        return delivery_id;
    }
    static async close(delivery_id){
        await db.query("UPDATE deliveries SET status = 2 where delivery_id = ?",[delivery_id]);
        await db.query('UPDATE books_quantity as bq,(SELECT * FROM delivery_product where delivery_id = 1) as dp SET bq.quantity = bq.quantity + dp.count where bq.book_id = dp.product_id and bq.cover_type = dp.cover_type and dp.delivery_id = ?',[delivery_id])
    }
    /*static async remove(provider_id){
        await db.query('DELETE FROM deliveries where provider_id = ?',[provider_id])
    }*/
}

module.exports = Deliveries;