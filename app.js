var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var configuration = require('./src/js/config.js');
var mongoose = require('mongoose');
var passport = require('passport');

var app = express();

//setup routes
require('./src/js/router.js')(app);

//pull in app configuration
config = configuration.data.production;

//development only
if (app.get('env') === 'development') {
    config = configuration.data.development;
}

// view engine setup (use sparingly, this is a RESTFUL service)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

mongoose.connect('mongodb://' + config.dbhost + '/' + config.dbname);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

    //404
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    //500
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });

} else {

    app.use(function(req, res, next) {
        var err     = new Error('Not Found');
        err.status  = 404;
        next();
    });

    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}

//initialization tasks:
console.log('environment: ' + app.get('env')); //show env in console for verification

//load data from source and fill cache
CardService.load();
RuleService.load();
ElementService.load();

module.exports = app;
