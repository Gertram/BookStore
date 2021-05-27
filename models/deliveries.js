let db = require('../app/db');
var dateFormat = require('dateformat');
const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;

class Deliveries {
    static async deliveries() {
        return (await mongo()).collection('deliveries')
    }

    static async getAll() {
        const delivers = await (await this.deliveries()).aggregate([
            {$unwind: {path: "$receiver"}},
            {
                $lookup: {
                    from: "users",
                    localField: "receiver.$id",
                    foreignField: "_id",
                    as: "receiver"
                }
            },
            {$unwind: {path: "$provider"}},
            {
                $lookup: {
                    from: "providers",
                    localField: "provider.$id",
                    foreignField: "_id",
                    as: "provider"
                }
            }
        ]).toArray();
        return delivers.map(item => {
            item.provider = item.provider[0];
            item.receiver = item.receiver[0];
            return item;
        });
    }

    static async get(delivery_id) {
        const delivery = await (await this.deliveries()).findOne({_id: ObjectId(delivery_id)});
        delivery.provider = await (await mongo()).collection("providervs").findOne({_id: ObjectId(delivery.provider.oid)})
        delivery.receiver = await (await mongo()).collection("users").findOne({_id: ObjectId(delivery.receiver.oid)})
        return delivery;
    }

    static async add(delivery_id, product_id, count, cover_type) {
        let products = await (await this.deliveries()).findOne({_id: ObjectId(delivery_id)}).products;
        if (products == null) {
            products = [];
        }
        products.push({count: count, info: {$ref: "books", $id: ObjectId(product_id), $db: "BookStore"}});

        return (await this.deliveries()).findOneAndUpdate({_id: ObjectId(delivery_id)}, {$set: {products: products}})
    }

    static async open(provider_id, receiver_id) {

        let date = dateFormat(new Date(), "yyyy-mm-dd")

        return (await (await this.deliveries()).insertOne({
            delivery_date: date,
            status: 1,
            products: [],
            receiver: {$ref: "users", $id: receiver_id, $db: "BookStore"},
            provider: {$ref: "providers", $id: ObjectId(provider_id), $db: "BookStore"}
        })).ops[0]
    }

    static async close(delivery_id) {
        (await this.deliveries()).findOneAndUpdate({_id: ObjectId(delivery_id)}, {$set: {status: 2}})
    }
}

module.exports = Deliveries;