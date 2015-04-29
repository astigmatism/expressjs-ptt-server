var passport = require('passport');
var Account = require('../models/account');
var Library = require('../services/library.js');

module.exports = function (app) {

    app.get('/register', function(req, res) {
        res.render('register', { });
    });

    app.post('/register', function(req, res) {
        
        Account.register(new Account({ username: req.body.username }), req.body.password, function(err, account) {
            if (err) {
                return res.render('register', {
                    info: 'Sorry. That username already exists. Try again.'
                });
            }

            //account created
            

            passport.authenticate('local')(req, res, function () {
                res.redirect('/');
            });
        });
    });

    app.get('/login', function(req, res) {
        res.render('login', { user : req.user });
    });

    app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, account, info) {
            //if error on auth
            if (err) {
                return res.render('login', {
                    info: err
                });
            }
            //if account not found
            if (!account) {
                return res.render('login', {
                    info: 'Invalid username or password.'
                });   
            }
            //auth success, not log in
            req.logIn(account, function(err) {
                if (err) { 
                    return res.render('login', {
                        info: err
                    });
                }
                return res.redirect('/');
            });
        })(req, res, next);
    });

    app.get('/logout', function(req, res) {
        req.session.destroy();
        req.logout();
        res.redirect('/');
    });
};