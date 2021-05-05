let db = require('../app/db');

class Books{
    static async getAll(filters = {}){
        let query = 'SELECT * FROM books';
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
        });
    }
    static async getNew(limit){
        let res = await db.query('SELECT *,(SELECT SUM(raiting) FROM raitings WHERE raitings.book_id = books.book_id) as raiting,(SELECT COUNT(*) FROM raitings WHERE raitings.book_id = books.book_id) as reviews_count FROM books where book_id in (SELECT * FROM (SELECT book_id FROM books order by date_added desc LIMIT 10) AS t) order BY RAND() LIMIT ?',[limit])
        return res[0]
    }
    static async get(book_id){
        let res = await db.query('SELECT *,(SELECT SUM(raiting) FROM raitings WHERE raitings.book_id = books.book_id) as raiting,(SELECT COUNT(*) FROM raitings WHERE raitings.book_id = books.book_id) as reviews_count FROM books WHERE book_id = ?',[book_id]);
        return res[0].map(function(val){
            let price = val['price'].toString();
            let left = price.slice(0,-2);
            let right = price.slice(-2);
            val['price'] = [left,right];
            return val;
        });
    }
    static async getFilter(books_list){
        let res = await db.query('SELECT *,(SELECT SUM(raiting) FROM raitings WHERE raitings.book_id = books.book_id) as raiting,(SELECT COUNT(*) FROM raitings WHERE raitings.book_id = books.book_id) as reviews_count FROM books WHERE book_id in (?)',[books_list]);
        return res[0].map(function(val){
            let price = val['price'].toString();
            let left = price.slice(0,-2);
            let right = price.slice(-2);
            val['price'] = [left,right];
            return val;
        });
    }
    static async add(title,description,genres,author_id){
        let res = await db.query('INSERT INTO books(title,description,author_id) values (?,?,?)',[title,description,author_id]);
        console.log(res);
    }
    static async search(keyword){
        keyword = '%' + keyword + '%';
        let res = await db.query("SELECT * FROM books WHERE title like ? or description like ?",[keyword,keyword]);
        return res[0].map(function(val){
            let price = val['price'].toString();
            let left = price.slice(0,-2);
            let right = price.slice(-2);
            val['price'] = [left,right];
            return val;
        });
    }
    static async getRange(){
        let res = await db.query('SELECT MIN(price) as min_price,MAX(price) as max_price FROM books');
        return res[0]
    }
    static async getMostPopular(limit){
        let res = await db.query('SELECT *,(SELECT count(*) FROM order_product WHERE order_product.product_id = books.book_id) as quantity,(SELECT SUM(raiting) FROM raitings WHERE raitings.book_id = books.book_id) as raiting,(SELECT COUNT(*) FROM raitings WHERE raitings.book_id = books.book_id) as reviews_count FROM books inner join authors on authors.author_id = books.author_id ORDER BY quantity DESC LIMIT ?',[limit])
        return res[0]
    }
}

module.exports = Books;