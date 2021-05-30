const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const multer = require("multer");
const logger = require('morgan');
const mongo = require('./app/mongo');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const shopRouter = require('./routes/shop');
const contactsRouter = require('./routes/contacts');
const linksRouter = require('./routes/links');
const aboutRouter = require('./routes/about');
const servicesRouter = require('./routes/services');
const adminRouter = require('./routes/admin');
const loginRouter = require('./routes/login');
const registrationRouter = require('./routes/registration');
const searchRouter = require('./routes/search');
const basketRouter = require('./routes/basket');
const ordersRouter = require('./routes/orders');

module.exports = async function() {
    const app = express();

     let res = await mongo.mongoClient.connect();
     let db_link = res.db("BookStore");

    app.use(function (req, res, next) {
        req.db = db_link;
        next();
    });

// view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'twig');


    app.use(logger('dev'));
    app.use(express.json());
    app.use(multer({dest: "uploads"}).single("filedata"));
    app.use(express.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Headers", "*");
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        next();
    });

    app.use(async function (req, res, next) {
        const users = require('./models/users');
        if (req.cookies.user == null) {
            return next();
        }
        let user = await users(req).get(req.cookies.user);
        if (user === undefined) {
            res.cookie('user', {maxAge: 0});
            return next();
        }

        req.user = user;
        next();
    });

    app.use('/', indexRouter);
    app.use('/admin', adminRouter)
    app.use('/users', usersRouter);
    app.use('/shop', shopRouter);
    app.use('/contacts', contactsRouter);
    app.use('/links', linksRouter);
    app.use('/services', servicesRouter);
    app.use('/about', aboutRouter);
    app.use('/login', loginRouter);
    app.use('/registration', registrationRouter);
    app.use('/search', searchRouter);
    app.use('/basket', basketRouter);
    app.use('/orders', ordersRouter);

// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });

// error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
    return app;
}