var ObjectId = require('mongodb').ObjectID;
var dateFormat = require('dateformat');


const count_sql = "COALESCE((SELECT SUM(count) FROM delivery_product where product_id = book_id),0) - COALESCE((SELECT SUM(quantity) FROM order_product where product_id = book_id),0) as quantity"

class Books {
    constructor(db) {
        this.db = db;
    }

    async books() {
        return this.db.collection("books");
    }

    async getAll(filters = {}, sortby = [],limit=1000) {
        let wheres = [];
        if (filters.min_price != null) {
            wheres.push({"price": {"$gte": filters.min_price}});
        }
        if (filters.max_price != null) {
            wheres.push({"price": {"$lte": filters.max_price}});
        }
        if (filters.genres != null) {
            wheres.push({"genres": {"$all": filters.genres}});
        }
        if (filters.tags != null) {
            wheres.push({"tags": {"$all": filters.tags}});
        }

        let query = wheres.length == 0 ? (await this.books()).find() : (await this.books()).find({$and: wheres});

        let sort = {_id:1}

        if (sortby == "popularity") {
            sort = {views: -1}
        }
        else if (sortby == "rating") {

        }
        else if (sortby == "date") {
            sort = {added_date: 1};
        }
        else if (sortby == "price") {
            sort = {price: 1}
        }
        else if (sortby == "price-desc") {
            sort = {price: -1}
        }
        return query.sort(sort).limit(limit).toArray();
    }

    async getNew(limit) {
        let res = await (await this.books()).aggregate([
            {
                $lookup: {
                    from: "genres",
                    localField: "genres.$id",
                    foreignField: "_id",
                    as: "genres"
                }
            },
            {
                $lookup: {
                    from: "tags",
                    localField: "tags.$id",
                    foreignField: "_id",
                    as: "tags"
                }
            },
            {
                $lookup: {
                    from: "authors",
                    localField: "authors.$id",
                    foreignField: "_id",
                    as: "authors"
                }
            },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "book.id",
                    as: "reviews"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reviews.user.id",
                    foreignField: "_id",
                    as: "users"
                }
            },

        ]).limit(limit).sort({"added_date": 1}).toArray();
        res = res.map(item => {
            item.raiting = item.reviews.reduce(((acc,cur) => acc + cur.raiting),null)
            for(let i = 0;i <item.reviews.length;i++){
                item.reviews[i].user = item.users[i];
            }
            return item;
        })
        console.log(res);
        return res;
    }

    async get(book_id) {
        let res = await (await this.books()).aggregate([
            {$match: {_id: ObjectId(book_id)}},
            {
                $lookup: {
                    from: "genres",
                    localField: "genres.$id",
                    foreignField: "_id",
                    as: "genres"
                }
            },
            {
                $lookup: {
                    from: "tags",
                    localField: "tags.$id",
                    foreignField: "_id",
                    as: "tags"
                }
            },
            {
                $lookup: {
                    from: "authors",
                    localField: "authors.$id",
                    foreignField: "_id",
                    as: "authors"
                }
            },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "book.id",
                    as: "reviews"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reviews.user.id",
                    foreignField: "_id",
                    as: "users"
                }
            },
            {
                $lookup: {
                    from: "lists",
                    localField: "lists.list",
                    foreignField: "_id",
                    as: "lists"
                }
            },

        ]).toArray();
        res = res.map(item => {
            item.raiting = item.reviews.reduce(((acc,cur) => acc + cur.raiting),null)
            for(let i = 0;i <item.reviews.length;i++){
                item.reviews[i].user = item.users[i];
            }
            return item;
        })
        console.log(res);

        return res[0];
    }

    async getFilter(books_list) {
        return (await this.books()).find({_id: {$in: books_list}}).toArray()
    }

    async redact(book_id, title, price, quantity,description, isbn,img, genres, authors,tags) {
        genres = genres.map(item => ({"$ref": "genres", "$id": ObjectId(item), "$db": "BookStore"}));
        tags = tags.map(item => ({"$ref": "tags", "$id": ObjectId(item), "$db": "BookStore"}));
        authors = authors.map(item => ({"$ref": "authors", "$id": ObjectId(item), "$db": "BookStore"}));
        if (img == null) {
            return (await this.books()).findOneAndUpdate({_id: ObjectId(book_id)}, {
                $set: {
                    title: title,
                    price: price,
                    description: description,
                    genres: genres,
                    isbn:isbn,
                    quantity:quantity,
                    authors: authors,
                    tags:tags
                }
            });
        }
        return (await this.books()).findOneAndUpdate({_id: ObjectId(book_id)}, {
            $set: {
                title: title,
                price: price,
                quantity:quantity,
                description: description,
                img: img,
                isbn:isbn,
                genres: genres,
                authors: authors,
                tags:tags
            }
        });
    }

    async addView(book_id) {
        return (await this.books()).findOneAndUpdate({_id: ObjectId(book_id)}, {$inc: {views: 1}})
    }

    async add(title, description, price, isbn, img, genres, authors) {
        genres = genres.map(item => {
            return {"$ref": "genres", "$db": "BookStore", "$id": ObjectId(item)}
        });
        authors = authors.map(item => {
            return {"$ref": "authors", "$db": "BookStore", "$id": ObjectId(item)}
        });
        return (await (await this.books()).insertOne({
            title: title,
            isbn: isbn,
            price: price,
            description: description,
            img: img,
            added_date: new Date(),
            genres: genres,
            authors: authors
        })).ops[0];
    }

    async search(keyword) {
        let res = await (await this.books()).aggregate([
            {$match: {title: {$regex: keyword, $options: 'i'}}},
            {
                $lookup: {
                    from: "genres",
                    localField: "genres.$id",
                    foreignField: "_id",
                    as: "genres"
                }
            },
            {
                $lookup: {
                    from: "tags",
                    localField: "tags.$id",
                    foreignField: "_id",
                    as: "tags"
                }
            },
            {
                $lookup: {
                    from: "authors",
                    localField: "authors.$id",
                    foreignField: "_id",
                    as: "authors"
                }
            },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "book.id",
                    as: "reviews"
                }
            },

        ]).toArray()
        res.map(item => {
            item.raiting = item.reviews.reduce(((acc,cur) => acc + cur.raiting),null)
            return item;
        })
        return res;
    }

    async getRange() {
        const res = await (await this.books()).aggregate([
            {$group: {_id: "$item", min_price: {$min: "$price"}, max_price: {$max: "$price"}}}
        ]).toArray();
        return res[0];
    }

    async getMostPopular(limit) {
        let res = await (await this.books()).aggregate([
            {
                $lookup: {
                    from: "genres",
                    localField: "genres.$id",
                    foreignField: "_id",
                    as: "genres"
                }
            },
            {
                $lookup: {
                    from: "tags",
                    localField: "tags.$id",
                    foreignField: "_id",
                    as: "tags"
                }
            },
            {
                $lookup: {
                    from: "authors",
                    localField: "authors.$id",
                    foreignField: "_id",
                    as: "authors"
                }
            },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "book.id",
                    as: "reviews"
                }
            },

        ]).sort({views: -1}).limit(limit).toArray();
        res.map(item => {
            item.raiting = item.reviews.reduce(((acc,cur) => acc + cur.raiting),null)
            return item;
        })
        return res;
    }

    async remove(book_id) {
        return (await this.books()).findOneAndDelete({_id: ObjectId(book_id)});
    }
}

module.exports = function (req) {
    return new Books(req.db);
};