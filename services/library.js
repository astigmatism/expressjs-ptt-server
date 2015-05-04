var config = require('../config.js');
var data = require('../models/data.js');
var async = require('async');
var type = require('type-of-is');
var utils = require('../models/utils');


/**
 * Returns card data given a card id or id's
 * @param  {String|Array|Number}   ids      The card id or id's in an array
 * @param  {Function} callback The function to return all data to
 * @return {Undefined}            
 */
exports.getCardsById = function(ids, callback) {
    
    var me          = this;
    var results     = {};

    if (!type.is(ids, Array)) {
        ids = [ids];
    }

    //load card id hash from cache.
    data.getCache('LibraryCardsById', function(content) {
        if (content) {
            
            var i = 0;
            for (i; i < ids.length; ++i) {
                if (content.LibraryCardsById.hasOwnProperty(ids[i])) {
                    results[ids[i]] = content.LibraryCardsById[ids[i]];
                } else {
                    results[ids[i]] = null;
                }
            }
            callback(results);
            return;
        } 
        //if not in cache, load from source and try again
        else {
            me.loadLibrary(function() {
                me.getCardById(ids, callback);
            });
        }
    });
    
};

/**
 * get a random card or set of cards given 
 * @param  {[type]}   level    [description]
 * @param  {Function} callback [description]
 * @param  {[type]}   unique   [description]
 * @return {[type]}            [description]
 */
exports.getRandomCardIdsByLevel = function(level, callback, unique) {

    var me      = this;
    var results = [];
    unique      = unique || false;

    if (!type.is(level, Array)) {
        level = [level];
    }

    //load card id hash from cache.
    data.getCache('LibraryCardsByLevel', function(content) {
        
        content = content.LibraryCardsByLevel;

        if (content) {
            
            var cardsbylevelpopped = {};

            var i = 0;
            for (i; i < level.length; ++i) {
                
                var currentlevel = String(level[i]);
                var cardsinlevel = content[currentlevel];

                //if unique results only, lets copy all the cards of this level and put them in the cardsByLevelPop object so we can random without replacement
                if (unique) {

                    //build array if doesnt exist
                    if (!type.is(cardsbylevelpopped[currentlevel], Array)) {
                        cardsbylevelpopped[currentlevel] = [];
                        for (var j = 0; j < cardsinlevel.length; ++j) {
                            cardsbylevelpopped[currentlevel].push(cardsinlevel[j].id); //push the id into the pop array
                        }
                    }

                    //ensure remaining entries exist
                    if (cardsbylevelpopped[currentlevel].length > 0) {
                        //shuffle the existing entries
                        utils.shuffle(cardsbylevelpopped[currentlevel]);
                        var item = cardsbylevelpopped[currentlevel].pop();
                        results.push(item);
                    } 
                    else {
                        results.push(null); //push null when no more cards are available
                    }

                } 
                //otherwise just take a random card from the main cache
                else {
                    var item = cardsinlevel[Math.floor(Math.random()*cardsinlevel.length)].id;
                    results.push(item);
                }

            }
            callback(results);
            return;
        } 
        //if not in cache, load from source and try again
        else {
            me.loadLibrary(function() {
                me.getRandomCardsByLevel(level, callback, unique);
            });
        }
    });
};

/**
 * Load's all library content into cache from data sources (files or mongo)
 * In the case of a source load error, a hard exception is throw as this data is essentially for proper application function
 * @param  {Function} optional. callback The function to call on load completion
 * @return {Undefined}            
 */
exports.loadLibrary = function(opt_callback) {

    var me                  = this;    
    var cardsById           = {};
    var cardsByName         = {};
    var cardsByLevel        = {};
    var cardsByStrength     = {};


    //retrieve card data from file (or cache)
    data.getFile({
        path:       '/docs/cards.json',
        forceLoad:  true,
        onSuccess:  function(content) {

            //construct "basic" set card hashes
            var i = 0;
            for (i; i < content.basic.length; ++i) {
                var item = content.basic[i];
                if (item.hasOwnProperty('id')) {
                    cardsById[String(item.id)] = item;
                }
                if (item.hasOwnProperty('name')) {
                    cardsByName[item.name] = item;   
                }
                if (item.hasOwnProperty('level')) {
                    if (!type.is(cardsByLevel[item.level], Array)) {
                        cardsByLevel[item.level] = [];
                    }
                    cardsByLevel[item.level].push(item);
                }
                if (item.hasOwnProperty('strength')) {
                    if (!type.is(cardsByStrength[item.strength], Array)) {
                        cardsByStrength[item.strength] = [];
                    }
                    cardsByStrength[item.strength].push(item);   
                }
            }

            data.setCache({
                items: [
                    {
                        key: 'LibraryCardsById',
                        content: cardsById
                    },
                    {
                        key: 'LibraryCardsByName',
                        content: cardsByName
                    },
                    {
                        key: 'LibraryCardsByStrength',
                        content: cardsByStrength
                    },
                    {
                        key: 'LibraryCardsByLevel',
                        content: cardsByLevel
                    }
                ],
                callback: function() {
                    if (opt_callback) opt_callback();
                }
            });
        },
        onError: function(error) {
            throw new Error(error);     //throw hard exception when we cannot retrieve the card data from its source, the application cannot function any further
        }
    });
};
