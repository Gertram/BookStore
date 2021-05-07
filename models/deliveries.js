let db = require('../app/db');

class Deliveries{
    /*static async getAll(){
        let res = await db.query('SELECT * FROM deliveries');
        return  res[0];
    }*/
    static async add(provider_id,receiver_id,products){
        let date = dateFormat(new Date(), "yyyy-mm-dd")

        let res = await db.query('INSERT INTO deliveries(provider_id,delivery_date,receiver_id) values (?,?,?)',[provider_id,date,receiver_id])

        let values = [];

        let delivery_id = res[0].insertId;

        products.forEach(product => {
            values.push(`(${delivery_id},${product.product_id},${product.count},${product.cover_type})`)
        });

        values = values.join(',');

        console.log(values)

        res = await db.query(`INSERT INTO delivery_product(delivery_id,product_id,count,cover_type) VALUES ${values};`);

        return delivery_id;
    }
    /*static async remove(provider_id){
        await db.query('DELETE FROM deliveries where provider_id = ?',[provider_id])
    }*/
}

module.exports = Deliveries;