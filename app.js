var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var configuration = require('./config.js');
var mongoose = require('mongoose');
var passport = require('passport');
var data = require('./models/data.js');
var CardService = require('./services/cards.js');
var RuleService = require('./services/rules.js');
var ElementService = require('./services/elements.js');

var authController = require('./controllers/auth');
var accountController = require('./controllers/account');
var cardsController = require('./controllers/cards');
var adminController = require('./controllers/admin');

var app = express();

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

mongoose.connect('mongodb://' + config.dbhost + '/' + config.dbname);

// Create our Express router
var router = express.Router();



router.route('/account/').get(authController.isAuthenticated, accountController.home);

router.route('/account/').delete(authController.isAuthenticated, accountController.deleteAccount);

router.route('/account/new').post(accountController.newAccount);

router.route('/cards/').get(authController.isAuthenticated, cardsController.getAllCards);

router.route('/cards/lastused').get(authController.isAuthenticated, cardsController.getLastUsed);

router.route('/admin/').get(authController.isAuthenticated, adminController.isAdmin);

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//initialization tasks:
console.log('environment: ' + app.get('env')); //show env in console for verification

//load data from source and fill cache
CardService.load();
RuleService.load();
ElementService.load();

module.exports = app;
