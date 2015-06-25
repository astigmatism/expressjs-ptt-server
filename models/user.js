
var UserRecord = require('../schemas/user');
var Library = require('../services/library');
var async = require('async');

exports.newUser = newUser = function(username, password, callback) {

    //choose the five cards this user will begin with
    Library.getRandomCardIdsByLevel([1, 1, 1, 1, 2], function(cardids) {

        cards = [];
        for (var i = 0; i < cardids.length; ++i) {
            cards.push({
                id: cardids[i],
                obtained: Date(),
                ingame: false,
                notes: 'starting card'
            });
        }

        var user = new UserRecord({
            username: username,
            password: password,
            cards: cards
        });

        user.save(function(err) {
            if (err) {
                callback({
                    success: false,
                    error: err
                });
                return;
            }

            callback({
                success: true
            });
        });

    }, true);
};

exports.getCards = getCards = function(user, callback) {

    var cards = [];

    Library.getIdDeck(function(deck) {

        for (var i = 0; i < user.cards.length; ++i) {
            cards.push({
                userdata: user.cards[i],
                carddata: deck[user.cards[i].id]
            });
        }
        callback(cards);
    });
};

exports.deleteUser = deleteUser = function(user, callback) {

    UserRecord.remove({ _id: user._id }, function(err) {
        if (err) {
            callback({
                success: false,
                error: err
            });
            return;
        }

        callback({
            success: true
        });
    });
};

exports.giveCard = giveCard = function(user, cardid, reason, callback) {

};