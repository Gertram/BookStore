const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;
var dateFormat = require('dateformat');


const count_sql = "COALESCE((SELECT SUM(count) FROM delivery_product where product_id = book_id),0) - COALESCE((SELECT SUM(quantity) FROM order_product where product_id = book_id),0) as quantity"

class Books{
    static async books(){
        return (await mongo()).collection("books");
    }
    static async getAll(filters = {}){
        return (await this.books()).find().toArray();
        /*let query = 'SELECT * FROM books';
        let wheres = [];
        if(filters.min_price != null){
            wheres.push('price >= ' + filters.min_price)
        }
        if(filters.max_price != null){
            wheres.push('price <= ' + filters.max_price)
        }
        if(filters.genres != null){
            wheres.push(`(SELECT count(*) FROM books_genres WHERE books_genres.book_id = books.book_id and genre_id in (${filters.genres.join(',')})) >= ${filters.genres.length}`)
        }
        if(filters.tags != null){
            wheres.push(`(SELECT count(*) FROM books_tags WHERE books_tags.book_id = books.book_id and tag_id in (${filters.tags.join(',')})) >= ${filters.tags.length}`)
        }
        if(filters.genres != null){
            wheres.push(`(SELECT count(*) FROM books_genres WHERE books_genres.book_id = books.book_id and genre_id in (${filters.genres.join(',')})) >= ${filters.genres.length}`)
        }
        if(wheres.length != 0){
            query += ' WHERE ' + wheres.join(' and ');
        }
        let res = await db.query(query);
        return res[0].map(function(val){
            let price = val['price'].toString();
            let left = price.slice(0,-2);
            let right = price.slice(-2);
            val['price'] = [left,right];
            return val;
        });*/
    }
    static async getNew(limit){
        return (await this.books()).find().limit(limit).sort({"added_date":-1}).toArray();
    }

    static async get(book_id){
        const book = await (await this.books()).findOne({_id:ObjectId(book_id)})
        const genres_list = book.genres.map(item => ObjectId(item.oid));
        book.genres = await (await mongo()).collection("genres").find({_id:{$in: genres_list}}).toArray()
        const authors_list = book.authors.map(item => ObjectId(item.oid));
        book.authors = await (await mongo()).collection("authors").find({_id:{$in: authors_list}}).toArray()
        return book;
    }
    static async getFilter(books_list){
        /*let res = await db.query('SELECT *,((SELECT SUM(raiting) FROM reviews WHERE reviews.book_id = books.book_id) / (SELECT COUNT(*) FROM reviews WHERE reviews.book_id = books.book_id)) as raiting,(SELECT COUNT(*) FROM reviews WHERE reviews.book_id = books.book_id) as reviews_count FROM books WHERE book_id in (?)',[books_list]);
        return res[0].map(function(val){
            let price = val['price'].toString();
            let left = price.slice(0,-2);
            let right = price.slice(-2);
            val['price'] = [left,right];
            return val;
        });*/
    }
    static async redact(book_id,title,price,description,img,genres,authors){
        genres = genres.map(item => ({"$ref":"genres","$id":ObjectId(item),"$db":"BookStore"}));
        authors = authors.map(item => ({"$ref":"authors","$id":ObjectId(item),"$db":"BookStore"}));
        if(img == null){
            return (await this.books()).findOneAndUpdate({_id:ObjectId(book_id)},{$set:{title:title,price:price,description:description,genres:genres,authors:authors}});
        }
        return (await this.books()).findOneAndUpdate({_id:ObjectId(book_id)},{$set:{title:title,price:price,description:description,img:img,genres:genres,authors:authors}});
    }
    static async addView(book_id){
        return (await this.genres()).findOneAndUpdate({_id:ObjectId(book_id)},{$inc:{views:1}})
    }
    static async add(title,description,price,img,genres,authors){
        let date = dateFormat(new Date(), "yyyy-mm-dd")

        genres = genres.map(item=>{
            return {"$ref":"genres","$db":"BookStore","$id":ObjectId(item)}
        });
        authors = authors.map(item=>{
            return {"$ref":"authors","$db":"BookStore","$id":ObjectId(item)}
        });
        return (await (await this.books()).insertOne({title:title,price:price,description:description,img:img,added_date:date,genres:genres,authors:authors})).ops[0];
    }
    static async search(keyword){
        let res = await (await this.books()).find({title:{$regex:keyword,$options:'i'}}).toArray()
        console.log(res);
        return res;
    }
    static async getRange(){
        const res = await (await this.books()).aggregate([
            {$group:{_id:"$item",min_price:{$min:"$price"},max_price:{$max:"$price"}}}
        ]).toArray();
        console.log(res);
        return res[0];
    }
    static async getMostPopular(limit){
        return (await this.books()).find().sort({views:-1}).limit(limit).toArray();
    }
    static async remove(book_id){
        return (await this.books()).findOneAndDelete({_id:ObjectId(book_id)});
    }
}

module.exports = Books;