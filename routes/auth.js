var passport = require('passport');
var Account = require('../models/account');
var Library = require('../services/library.js');
var BasicStrategy = require('passport-http').BasicStrategy;

module.exports = function (app) {

    //app.get('/register', function(req, res) {
    //    res.render('register', { });
    //});

    app.post('/register', function(req, res) {

        var account = new Account({
            username: req.body.username,
            password: req.body.password
        });

        user.save(function(err) {
            if (err) {
                return res.json({
                    success: false,
                    error: err
                });
            }
                
            return res.json({
                success: true,
                user: account
            });
        });
    });

    //app.get('/login', function(req, res) {
    //    res.render('login', { user : req.user });
    //});

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
        res.json({
            logout: true
        });
    });
};