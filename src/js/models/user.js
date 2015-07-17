/**
 *
 * User Model Object
 * This class represents an instance of the "logged in" user - it's an object created on each incoming request once authorization is successful and a user object is returned
 * from Mongo. It should only contain operations relevant to the current user. For more general-purchase user-specific functions, see the User Service
 *
 */

var CardService = require('../services/cards');
var UserServuce = require('../services/users');
var Utils   = require('../models/utils');
var async = require('async');

/**
 * User Constructor
 * @param {Object} user MongoDB user record returned from authorization success
 */
function User(user) {

    /**
     * _id
     * @type {string}
     */
    this._userid     = user._id;

    /**
     * is admin
     * @type {boolean}
     */
    this._adminlevel = user.adminlevel;

    /**
     * username
     * @type {string}
     */
    this._username   = user.username;

    /**
     * user's cards
     * @type {Array}
     */
    this._cards      = user.cards.toObject(); //mongoose objects are immutable, to extend this set, convert to object

    /**
     * password
     * @type {string}
     */
    this._password   = user.password;

    /**
     * win count
     * @type {number}
     */
    this._wins       = user.wins;

    /**
     * loss count
     * @type {number}
     */
    this._loses      = user.loses;

    /**
     * draw count
     * @type {number}
     */
    this._draws      = user.draws;
}

/**
 * removes user
 * @param  {Function} callback
 * @return {undefined}
 */
User.prototype.removeAccount = function(callback) {

    UserService.removeAccount(this._userid, callback);
};

/**
 * utility: for better card management, create a map (by mongo id) of the cards array from mongo
 * @return {Object}
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
 * @param  {string} subset      special rules around which cards should be returned: lastUsed|all
 * @return {undefined}
 */
User.prototype.getCards = function(callback, subset) {

    subset = subset || 'all';

    var result = {};
    var card;
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
 * Returns whether this user is set to an admin level
 * @param  {number}  level
 * @return {boolean}
 */
User.prototype.getAdminLevel = function() {
    return this._adminlevel;
};

module.exports = User;

