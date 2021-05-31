const mongo = require('../app/mongo');
var ObjectId = require('mongodb').ObjectID;


class Reviews{
    constructor(db){
        this.db = db;
    }
    async reviews(){
        return this.db.collection("reviews");
    }
    async getAll(){
        return (await reviews()).find().toArray();
        /*let res = await db.query('SELECT * FROM reviews INNER JOIN users on users.user_id = reviews.user_id');
        return  res[0];*/
    }
    async get(review_id){
        return (await this.reviews()).findOne({_id:review_id});
        l/*et res = await db.query('SELECT reviews.*,users.user_id,users.username,books.title FROM reviews INNER JOIN users on users.user_id = reviews.user_id inner JOIN books on reviews.book_id = books.book_id where review_id = ?',[review_id]);
        return  res[0];*/
    }
    async approve(review_id,employee_id){
        return (await this.reviews()).findOneAndUpdate({_id:review_id},{$set:{status:3,employee:{id:employee_id}}});
        //await db.query('UPDATE reviews SET status = 3,employee_id = ? where review_id = ?',[employee_id,review_id]);
    }
    async reject(review_id,employee_id,cause){
        return (await this.reviews()).findOneAndUpdate({_id:review_id},{$set:{status:2,employee:{id:employee_id}}});
        //await db.query('UPDATE reviews SET status = 2,employee_id = ?,cause = ? where review_id = ?',[employee_id,review_id,cause]);
    }
    async getAllWithBook(){
        return (await this.reviews()).aggregate([
            {$unwind: {path: "$book"}},
            {
                $lookup: {
                    from: "books",
                    localField: "book.$id",
                    foreignField: "_id",
                    as: "book"
                }
            }
        ]).toArray();
        /*let res = await db.query('SELECT reviews.*,users.user_id,users.username,books.title FROM reviews INNER JOIN users on users.user_id = reviews.user_id inner JOIN books on reviews.book_id = books.book_id');
        return  res[0];*/
    }
    async getAllForBook(book_id){
        return (await this.reviews()).aggregate([
            {$unwind: {path: "$book"}},
            {
                $lookup: {
                    from: "books",
                    localField: "book.$id",
                    foreignField: "_id",
                    as: "book"
                }
            },
            {$match:{books:{_id:book_id}}}
        ]).toArray();
        /*let res = await db.query('SELECT reviews.*,users.user_id,users.username,books.title FROM reviews INNER JOIN users on users.user_id = reviews.user_id inner JOIN books on books.book_id = ? where reviews.book_id = ?',[book_id,book_id]);
        return  res[0];*/
    }
    async add(user_id,book_id,raiting,comment){
        return (await this.reviews()).insertOne({raiting:1,text:comment,status:1,employee:{id:user_id},book:{id:book_id}});
        //await db.query(`INSERT INTO reviews(user_id,book_id,raiting,text) values (${user_id},${book_id},${raiting},'${comment}')`);
    }
    async remove(review_id){
        return (await this.reviews()).findOneAndDelete({_id:review_id});
        //await db.query('DELETE FROM reviews where book_id = ? and user_id',[book_id,user_id]);
    }
}

module.exports = function (req) {
    return new Reviews(req.db);
};