// Load required packages
var User    = require('../models/user');
var async = require('async');

exports.getAllCards = function(req, res) {
    
    var user = new User(req.user);

    user.getCards(function(cards) {
        return res.json({
            success: true,
            cards: cards
        });
    });
};

exports.getHand = function(req, res) {

    var user = new User(req.user);

    user.getCards(function(cards) {
        return res.json({
            success: true,
            cards: cards
        });
    }, 'hand');
};

exports.getDeck = function(req, res) {

    var user = new User(req.user);

    user.getCards(function(cards) {
        return res.json({
            success: true,
            cards: cards
        });
    }, 'deck');
};

exports.move = function(req, res) {

    var user        = new User(req.user);
    var toHand      = (req.body.hand) ? req.body.hand.split(',') : [];
    var toDeck      = (req.body.deck) ? req.body.deck.split(',') : [];

    //parallel allows for multiple functions. we're going to parallel async for setting cards to hand and deck
    async.parallel([
        //function one - async each toHand
        function(callback){
            async.each(toHand, function(item, next) {
                user.moveCard(item.trim(), 'hand', function() {
                    next();
                });
            }, function(err) {
                callback();
            });
        },
        //function two - async each toDeck
        function(callback){
            async.each(toDeck, function(item, next) {
                user.moveCard(item.trim(), 'deck', function() {
                    next();
                });
            }, function(err) {
                callback();
            });
        }
    ],
    function(err){
        if (err) {
            return res.json({
                success: false,
                error: err
            });
        }

        return res.json({
            success: true
        });
    });
};
