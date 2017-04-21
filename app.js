"use strict";
const express = require('express');
const app = express();


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
////////////////////////////////////////////
//Body Parse
/////////////////////////////////////////////
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));

////////////////////////////////////////////
//Template Engine
/////////////////////////////////////////////
const helpers = require('./helpers');
const expressHandlebars = require('express-handlebars');
var hbs = expressHandlebars.create({
    partialsDir: 'views/',
    defaultLayout: 'layout',
    helpers: helpers.registered
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

////////////////////////////////////////////
//Session
/////////////////////////////////////////////
var session = require('express-session');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));

//Set default values on the currentUser controller
app.use(function(req, res, next) {
    //currentUser not yet defined
    //first set default for that
    if (!req.session.currentUser) {
        req.session.currentUser = {};
    }
    if (!req.session.currentUser.cart) {
        req.session.currentUser.cart = [];
    }
    next();
});

app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.currentUser = req.session.currentUser;
    next();
});

////////////////////////////////////////////
//Serve static files
/////////////////////////////////////////////
app.use(express.static(__dirname + "/public"));
/////////////////////////////////////
//Setup Mongoose Connection
////////////////////////////////////
var mongoose = require('mongoose');
app.use((req, res, next) => {
    if (mongoose.connection.readyState) {
        next();
    }
    else {
        require('./mongo')().then(() => next());
    }
});




// Put this AFTER your body-parser set up
/////////////////////////////////////////
//Method override
//////////////////////////////////////////
app.use((req, res, next) => {
    var method;

    // Allow method overriding in
    // the query string and POST data
    // and remove the key after found
    if (req.query._method) {
        method = req.query._method;
        delete req.query._method;
    }
    else if (typeof req.body === 'object' && req.body._method) {
        method = req.body._method;
        delete req.body._method;
    }

    // Upcase the method name
    // and set the request method
    // to override it from GET to
    // the desired method
    if (method) {
        method = method.toUpperCase();
        req.method = method;
    }

    next();
});


////////////////////////////////////////////
// Flash Messages
/////////////////////////////////////////////
var flash = require('express-flash-messages');
app.use(flash());


////////////////////////////////////////////
//Routers
/////////////////////////////////////////////
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');
const chargesRouter = require('./routes/charges');
const adminRouter = require('./routes/admin');
app.use('/admin', adminRouter);
app.use('/charges', chargesRouter);
app.use('/checkout', checkoutRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.get('/', function(req, res) {
    res.redirect('/products');
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



var port = (process.env.PORT || '3000');

app.listen(port, () => {
    console.log("Server now listening");
});
