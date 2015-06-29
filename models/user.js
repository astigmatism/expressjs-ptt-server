var UserStore = require('../schemas/user');
var CardService = require('../services/cards');
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
     * is admin
     * @type {Boolean}
     */
    this._admin      = user.admin;

    /**
     * username
     * @type {String}
     */
    this._username   = user.username;

    /**
     * user's cards
     * @type {Array}
     */
    this._cards      = user.cards.toObject(); //mongoose objects are immutable, to extend this set, convert to object

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
    CardService.getRandomCardIdsByLevel([1, 1, 1, 1, 2], function(cardids) {

        cards = [];
        for (var i = 0; i < cardids.length; ++i) {
            cards.push({
                cardid: cardids[i],
                lastUsed: true,         //set this to true so that the game understands these are your starting cards for your first game
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
 * Admin creation routine. NEVER expose this through an api
 * @param  {String}   username 
 * @param  {String}   password 
 * @param  {Function} callback 
 * @return {undef}            
 */
User.createAdmin = function(username, password, callback) {

    var user = new UserStore({
        username: username,
        password: password,
        admin: true
    });

    user.save(function(err) {
        callback(err);
    });
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
 * utility: for better card management, create a map (by mongo id) of the cards array from mongo
 * @param  {[type]} mongocards [description]
 * @return {[type]}            [description]
 */
User.prototype._mapCards = function() {

    var cardmap = {};
    for (var i = 0; i < this._cards.length; ++i) {
        cardmap[this._cards[i]._id] = this._cards[i];
    }
    return cardmap;
};

/**
 * Returns all or a set of user's cards 
 * @param  {Function} callback
 * @param  {String} subset      special rules around which cards should be returned: lastUsed|all
 * @return {undef}            
 */
User.prototype.getCards = function(callback, subset) {

    subset = subset || 'all';

    var result = {};
    var map = this._mapCards();

    CardService.getCardMap('ID', function(library) {

        
        if (subset === 'lastUsed') {
            for (card in map) {
                if (map[card].lastUsed) {
                    result[card] = Utils.extend({}, map[card], library[map[card].cardid]);        
                }
            }
            callback(null, result);
            return;
        }

        //default "all" behavior
        for (card in map) {
            result[card] = Utils.extend({}, map[card], library[map[card].cardid]);
        }
        callback(null, result);
    }); 
};

/**
 * DEPRICATED: we no longer use the "inhand" or "indeck" concepts. cards are either "ingame" or not
 * move's a group of cards to hand or deck
 * @param  {Array|String}   tohand   an array of cardid's to move from deck to hand. If already in hand, no change
 * @param  {Array|String}   todeck   an array of cardid's to move from hand to deck. If already in deck, no change
 * @param  {Function} callback 
 * @return {undef}            
 */
// User.prototype.moveCards = function(tohand, todeck, callback) {

//     var cardmap = this._createCardIdMap(); //create a lookup map by id for easy searching

//     for (var i = 0; i < tohand.length; ++i) {
//         //if incoming card id is found as belonging to this user
//         var cardid = tohand[i].trim();
//         if (cardmap[cardid]) {
//             cardmap[cardid].inhand = true;
//         }
//     }
//     for (var i = 0; i < todeck.length; ++i) {
//         //if incoming card id is found as belonging to this user
//         var cardid = todeck[i].trim();
//         if (cardmap[cardid]) {
//             cardmap[cardid].inhand = false;
//         }
//     }

//     //after all changes are made, wholesale save the cards array back to the data store
//     UserStore.update({_id: this._userid}, { cards: this._cards }, function(err, results) {
//         callback(err, results);
//     });
// };

User.prototype.mongoRecord = function(callback) {

    UserStore.find({_id: this._userid }, function(err, result) {
        callback(err, result);
    });
};

module.exports = User;

