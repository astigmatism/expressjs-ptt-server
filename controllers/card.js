// Load required packages
var User  = require('../models/user');
var UserService = require('../services/users');
var async = require('async');

CardController = function() {

};

//ADMIN API's

CardController.giveRandomLevelCardToUser = function(req, res) {

    var username  = req.body.username; 
    var level   = req.body.level;
    var notes   = req.body.notes || '';

    if (!level || !username) {
        return res.json({
            success: false,
            error: {
                message: 'username and level requied in postdata'
            }
        }); 
    }

    UserService.getUserByName(username, function(err, user) {

        if (err) {
            return res.json({
                success: false,
                error: err
            });
        }

        CardService.giveRandomLevelCardsToUser(user._id, level, notes, function (err) {

            if (err) {
                return res.json({
                    success: false,
                    error: err
                });
            }

            return res.json({
                success: true,
                card: card
            });
        });
    });
};


//AUTHENTICATED API's

CardController.getAllCards = function(req, res) {
    
    var user = new User(req.user);

    user.getCards(function(err, cards) {
        if (err) {
            return res.json({
                success: false,
                error: err
            });
        }

        return res.json({
            success: true,
            cards: cards
        });
    });
};

CardController.getLastUsed = function(req, res) {

    var user = new User(req.user);

    user.getCards(function(err, cards) {
        if (err) {
            return res.json({
                success: false,
                error: err
            });
        }

        return res.json({
            success: true,
            cards: cards
        });
    }, 'lastUsed');
};

module.exports = CardController;
