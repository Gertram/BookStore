let db = require('../app/db');

const count_sql = "COALESCE((SELECT SUM(count) FROM delivery_product where product_id = book_id),0) - COALESCE((SELECT SUM(quantity) FROM order_product where product_id = book_id),0) as quantity"

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
        });
    }
    static async getNew(limit){
        let res = await db.query('SELECT *,((SELECT SUM(raiting) FROM reviews WHERE reviews.book_id = books.book_id) / (SELECT COUNT(*) FROM reviews WHERE reviews.book_id = books.book_id)) as raiting,(SELECT COUNT(*) FROM reviews WHERE reviews.book_id = books.book_id) as reviews_count FROM books where book_id in (SELECT * FROM (SELECT book_id FROM books order by date_added desc LIMIT 10) AS t) order BY RAND() LIMIT ?',[limit])

        return res[0]
    }
    static async getShort(book_id){
        let book_promise = db.query('SELECT * FROM books where book_id = ?',[book_id]);
        let authors_promise = db.query('SELECT authors.* FROM books_authors,authors where books_authors.book_id = ? and books_authors.author_id = authors.author_id',[book_id])
        let genres_promise = db.query('SELECT genres.* FROM books_genres,genres where books_genres.book_id = ? and books_genres.genre_id = genres.genre_id',[book_id])

        let res = await Promise.all([book_promise,authors_promise,genres_promise]);
        let book_data = res[0];
        let author_data = res[1];
        let genres_data = res[2];

        let book = book_data[0][0];
        if(book == null){
            return null;
        }
        book.authors = author_data[0]
        book.genres = genres_data[0]

        return book;
    }
    static async get(book_id){
        let res = await db.query(`SELECT *,((SELECT SUM(raiting) FROM reviews WHERE reviews.book_id = books.book_id) / (SELECT COUNT(*) FROM reviews WHERE reviews.book_id = books.book_id)) as raiting,(SELECT COUNT(*) FROM reviews WHERE reviews.book_id = books.book_id) as reviews_count FROM books where book_id = ?`,[book_id]);

        let gres = await db.query('SELECT genres.* FROM books_genres,genres where books_genres.book_id = ? and books_genres.genre_id = genres.genre_id',[book_id])

        res[0][0].genres = gres[0]

        return res[0];
    }
    static async getFilter(books_list){
        let res = await db.query('SELECT *,((SELECT SUM(raiting) FROM reviews WHERE reviews.book_id = books.book_id) / (SELECT COUNT(*) FROM reviews WHERE reviews.book_id = books.book_id)) as raiting,(SELECT COUNT(*) FROM reviews WHERE reviews.book_id = books.book_id) as reviews_count FROM books WHERE book_id in (?)',[books_list]);
        return res[0].map(function(val){
            let price = val['price'].toString();
            let left = price.slice(0,-2);
            let right = price.slice(-2);
            val['price'] = [left,right];
            return val;
        });
    }
    static async redact(book_id,title,price,description,img,genres,authors){
        let promise1 = null;
        if(img == null){
            promise1 =  db.query('UPDATE books SET title = ?, price = ?,description = ? where book_id = ?',[title,price,description,book_id]);
        } else{
            promise1 =  db.query('UPDATE books SET title = ?, price = ?,description = ?,img = ? where book_id = ?',[title,price,description,img,book_id]);
        }
        const promise2 = db.query('DELETE FROM books_genres where book_id = ?',[book_id]);
        const promise3 = db.query('DELETE FROM books_authors where book_id = ?',[book_id]);

        const genres_values = genres.map(genre => `(${book_id},${genre})`).join(',')

        const authors_values = authors.map(author => `(${book_id},${author})    `).join(',')

        await Promise.all([promise1,promise2,promise3]);

        const promise4 = db.query(`INSERT INTO books_genres(book_id,genre_id) values ${genres_values}`);
        const promise5 = db.query(`INSERT INTO books_authors(book_id,author_id) values ${authors_values}`);

        await Promise.all([promise4,promise5]);
    }
    static async add(title,description,price,img,genres,authors){
        let res = await db.query('INSERT INTO books(title,price,img,description) values (?,?,?,?)',[title,price,img,description]);

        let book_id = res[0].insertId

        const genres_values = genres.map(genre => `(${book_id},${genre})`).join(',')

        const authors_values = authors.map(author => `(${book_id},${author})    `).join(',')

        let promise1 = db.query(`INSERT INTO books_genres(book_id,genre_id) values ${genres_values}`);
        let promise2 = db.query(`INSERT INTO books_authors(book_id,author_id) values ${authors_values}`);

        res = await Promise.all([promise1,promise2]);

        return book_id;
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
        const query = `SELECT *,
                (SELECT count(*) FROM order_product WHERE order_product.product_id = books.book_id) as quantity,
                ((SELECT SUM(raiting) FROM reviews WHERE reviews.book_id = books.book_id) / (SELECT COUNT(*) FROM reviews WHERE reviews.book_id = books.book_id)) as raiting,
                (SELECT COUNT(*) FROM reviews WHERE reviews.book_id = books.book_id) as reviews_count 
                FROM books ORDER BY quantity DESC LIMIT ${limit}`;

        let res = await db.query(query)
        return res[0]
    }
    static async remove(book_id){
        let res = await db.query('DELETE FROM books WHERE book_id = ?',book_id);
    }
}

module.exports = Books;