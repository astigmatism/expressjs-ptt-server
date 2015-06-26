var UserStore = require('../schemas/user');
var Library = require('../services/library');
var Utils   = require('../models/utils');
var async = require('async');


/**
 * User Constructor
 * @param {Object} user MongoDB user record returned from authorization success
 */
function User(user) {
    
    /**
     * _id
     * @type {String}
     */
    this._userid     = user._id;

    /**
     * username
     * @type {String}
     */
    this._username   = user.username;

    /**
     * user's cards
     * @type {Array|Objects}
     */
    this._cards      = user.cards;

    /**
     * password
     * @type {String}
     */
    this._password   = user.password;

    /**
     * win count
     * @type {Number}
     */
    this._wins       = user.wins;

    /**
     * loss count
     * @type {Number}
     */
    this._loses      = user.loses;

    /**
     * draw count
     * @type {Number}
     */
    this._draws      = user.draws;
}

/**
 * User creation, not on prototype
 * @param  {String}   username 
 * @param  {String}   password 
 * @param  {Function} callback
 * @return {undef}
 */
User.create = function(username, password, callback) {
    
    //choose the five cards this user will begin with
    Library.getRandomCardIdsByLevel([1, 1, 1, 1, 2], function(cardids) {

        cards = [];
        for (var i = 0; i < cardids.length; ++i) {
            cards.push({
                cardid: cardids[i],
                obtained: Date(),
                inhand: true,
                notes: 'Starting Card'
            });
        }

        var user = new UserStore({
            username: username,
            password: password,
            cards: cards
        });

        user.save(function(err) {
            callback(err);
        });

    }, true);
};

/**
 * removes user
 * @param  {Function} callback 
 * @return {undef}            
 */
User.prototype.remove = function(callback) {

    UserStore.remove({ _id: this._userid }, function(err) {
        callback(err);
    });
};

/**
 * Creates a handy cardid lookup map, Sometimes usful as a utility when the alternative is to iterate over the this.cards array several times
 * @return {Object}
 */
User.prototype._createCardIdMap = function() {

    var cardmap = {};

    for (var i = 0; i < this._cards.length; ++i) {
        cardmap[this._cards[i]._id] = this._cards[i];
    }

    return cardmap;
};

/**
 * Returns all or a set of user's cards 
 * @param  {Function} callback 
 * @param  {String}   subset   all|hand|deck. defaults to all
 * @return {undef}            
 */
User.prototype.getCards = function(callback, subset) {

    subset = subset || 'all';

    var cards = [];
    var that = this;

    Library.getIdDeck(function(library) {

        //for loop seems to be slightly better for performance (than async)
        for (var i = 0; i < that._cards.length; ++i) {
            
            if ((subset === 'hand' && that._cards[i].inhand) || (subset === 'deck' && !that._cards[i].inhand) || subset === 'all') {

                var details = Utils.extend(library[that._cards[i].cardid], {
                    _id: that._cards[i]._id,
                    obtained: that._cards[i].obtained,
                    inhand: that._cards[i].inhand,
                    notes: that._cards[i].notes
                });
                cards.push(details);
            }
        };
        callback(cards);
    }); 
};

User.prototype.moveCard = function(cardid, destination, callback) {

    var cardmap = this._createCardIdMap();

    if (cardmap[cardid]) {
        if (destination === 'deck') {
            cardmap[cardid].inhand = false;
        }
    }

    UserStore.update({_userid: this._userid}, { cards: this._cards }, function(err, results) {
        callback(err, results);
    });
};

User.prototype.mongoRecord = function(callback) {

    UserStore.find({_id: this._userid }, function(err, result) {
        callback(err, result);
    });
};

module.exports = User;

