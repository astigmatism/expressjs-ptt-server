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

    //TODO: moving cards should be disallowed while user is engaged in a game
    
    user.moveCards(toHand, toDeck, function(err, result) {

        if (err) {
            return res.json({
                success: false,
                error: err
            });
        }

        return res.json({
            success: true,
            result: result
        });
    });
};

exports.moveToHand = function(req, res) {

    var user        = new User(req.user);
    var cardids     = (req.body.cardids) ? req.body.cardids.split(',') : [];

    user.moveCards(cardids, [], function(err, result) {

        if (err) {
            return res.json({
                success: false,
                error: err
            });
        }

        return res.json({
            success: true,
            result: result
        });
    });
}