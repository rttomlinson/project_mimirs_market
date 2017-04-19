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
    extended: false
}));

////////////////////////////////////////////
//Template Engine
/////////////////////////////////////////////
const expressHandlebars = require('express-handlebars');
var hbs = expressHandlebars.create({
    partialsDir: 'views/',
    defaultLayout: 'layout'
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

app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.currentUser = req.session.currentUser;
    next();
});

////////////////////////////////////////////
//Serve static files
/////////////////////////////////////////////
app.use(express.static(__dirname + "/public"));

////////////////////////////////////////////
//Routers
/////////////////////////////////////////////





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
