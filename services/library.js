/**
 * Library
 */

var config = require('../config.js');
var data = require('../models/data.js');
var async = require('async');
var type = require('type-of-is');

/**
 * Library constructor
 */
function Library() {
};

/**
 * Returns card data given a card id or id's
 * @param  {String|Array|Number}   ids      The card id or id's in an array
 * @param  {Function} callback The function to return all data to
 * @return {Undefined}            
 */
Library.prototype.getCardsById = function(ids, callback) {
    
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

Library.prototype.getCardsByLevel = function(level, callback) {

    var me      = this;
    var results = [];

    if (!type.is(level, Array)) {
        level = [level];
    }

    //let's just get the cards by id hash from cache
    data.getCache('LibraryCardsById', function(content) {
        if (content) {

            var i = 0;
            for (i; i < content; ++i) {
                
            }
        }
        //if not in cache, load from source and try again
        else {
            me.loadLibrary(function() {
                me.getCardsByLevel(level, callback);
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
Library.prototype.loadLibrary = function(opt_callback) {

    var me                  = this;    
    var cardsById           = {};
    var cardsByName         = {};


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

module.exports = Library;
