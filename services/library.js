/**
 * Library
 */

var config = require('../config.js');
var data = require('../models/data.js');

/**
 * Library constructor
 * @param {Object}
 *  forceLoad: {Boolean} should the library's data be loaded directly from its source (true) or is cache okay? (false, default)
 */
function Library(options) {

    //params
    var forceLoad           = options.forceLoad || false;
    var callback            = options.callback;

    //scoped
    var me                     = this;

    //if we've specified a force load, load directly from source
    if (forceLoad) {
        me.loadDataFromSource({
            callback: callback
        });
        return;
    }

    //if not a force load, take from cache
    data.getCache({
        keys:       ['LibraryCardsById','LibraryCardsByName'],
        callback:  function(content) {
                
            if (content.LibraryCardsById && content.LibraryCardsByName) {
                global.cardsById   = content.LibraryCardsById;
                global.cardsByName = content.LibraryCardsByName;
                callback();
                return;
            }

            //if cache not defined, load from source again
            me.loadDataFromSource({
                callback: callback
            });
        }
    });
};

Library.prototype.loadDataFromSource = function(options) {

    var callback            = options.callback;
    var me                  = this;


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
                    global.cardsById[String(item.id)] = item;
                }
                if (item.hasOwnProperty('name')) {
                    global.cardsByName[item.name] = item;   
                }
            }

            //TODO: It's possible we'll process other card sets in the future?

            data.setCache({
                items: [
                    {
                        key: 'LibraryCardsById',
                        content: global.cardsById
                    },
                    {
                        key: 'LibraryCardsByName',
                        content: global.cardsByName
                    }
                ],
                callback: function() {

                    //finally, callback saying the constructor compeltely successfully
                    callback();
                }
            });
        },
        onError: function(error) {
            throw new Error(error);     //throw hard exception when we cannot retrieve the card data from its source, the application cannot function any further
        }
    });
};

Library.prototype.getCardById = function(id) {
    
    if (global.cardsByName.hasOwnProperty(id)) {
        return global.cardsByName[id];
    }
    return null;
};

Library.prototype.getCardByName = function(name) {
    
    if (global.cardsByName.hasOwnProperty(name)) {
        return global.cardsByName[name];
    }
    return null;
};

module.exports = Library;
