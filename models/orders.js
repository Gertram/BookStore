const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;
var dateFormat = require('dateformat');

class Orders {
    constructor(db) {
        this.db = db;
    }

    async orders() {
        return this.db.collection("orders");
    }

    async getAll(filters, sorting) {
        let filter = new Array();
        console.log(filters);
        if (filters.mindate != "") {
            filter.push({date:{$gte:new Date(filters.mindate+ "T00:00:00.000Z")}})
        }else if (filters.maxdate != "") {
            filter.push({date: {$lte: new Date(filters.maxdate + "T23:59:59.000Z")}})
        } else if (filters.customer != "") {
            filter.push({$or: [{surname: filters.customer}, {name: filters.customer}, {middlename: filters.customer}]})
        } else if (filters.status != "") {
            filter.push({status: filters.status})
        }
        console.log(filter);

        let query = null;
        if (filter.length == 0) {
            query = (await this.orders()).aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "customer.id",
                        foreignField: "_id",
                        as: "customer"
                    }
                }
            ]);
        } else {
            query = (await this.orders()).aggregate([
                {$match: {$and: filter}},
                {
                    $lookup: {
                        from: "users",
                        localField: "customer.id",
                        foreignField: "_id",
                        as: "customer"
                    }
                }
            ]);
        }

        let sort = {_id: 1};

        if (sorting == "date") {
            sort = {date: 1}
        } else if (sorting == "date_desc") {
            sort = {date: -1}
        } else if (sorting == "amount") {
            sort = {amount: 1}
        } else if (sorting == "amount_desc") {
            sort = {amount: -1}
        } else if (sorting == "customer") {
            sort = {surname: 1, name: 1, middlename: 1}
        } else if (sorting == "customer_desc") {
            sort = {surname: -1, name: -1, middlename: -1}
        }

        let res = await query.sort(sort).toArray();

        return res.map(item => {
            item.date = new Date(item.date).toUTCString();
            if (item.customer == null) {
                return item;
            }
            item.customer = item.customer[0]
            return item;
        })
    }

    async getUser(user) {
        return (await this.orders()).find({customer: {id: user}}).toArray()
    }

    async get(order) {
        let res = await (await this.orders()).aggregate([
            {$match: {_id: ObjectId(order)}},
            {
                $lookup: {
                    from: "books",
                    localField: "products.id",
                    foreignField: "_id",
                    as: "items"
                }
            }
        ]).toArray();

        if (res.length == 0) {
            return null;
        }

        res = res[0];

        res.date = new Date(res.date).toUTCString()

        for (let i = 0; i < res.products.length; i++) {
            res.products[i].book = res.items[i];
        }

        return res
    }
    async next(order){
        return (await this.orders()).findOneAndUpdate({_id:ObjectId(order)},{$inc:{status:1}})
    }
    async add(products, surname, name, middlename, phone, address, number, validity, owner, code, customer) {
        console.log(products);
        products = products.map(item => ({id: ObjectId(item.book._id), quantity: item.quantity, price: item.book.price}));

        const amount = products.reduce(((acc, cur) => acc + parseInt(cur.price) * parseInt(cur.quantity)), 0);

        return (await (await this.orders()).insertOne({
            surname: surname,
            name: name,
            amount: 0,
            middlename: middlename,
            phone: phone,
            address: address,
            date: new Date(),
            status:1,
            customer: {id: ObjectId(customer)},
            products: products
        })).ops[0]
    }
}

module.exports = function (req) {
    return new Orders(req.db);
};