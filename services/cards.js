var config = require('../config.js');
var data = require('../models/data.js');
var type = require('type-of-is');
var utils = require('../models/utils');

CardService = function() {

};

CardService.CACHENAMES = {
	ID: 		'CardServiceMap_Id',
	NAME: 		'CardServiceMap_Name',
	LEVEL: 		'CardServiceMap_Level',
	STRENGTH: 	'CardServiceMap_Strength'
};

CardService.load = function(callback) {
	
	var byid 	= {};
	var byname 	= {};
	var bylevel = {};
	var bystren = {};

	data.getFile({
        path:       '/docs/cards.json',
        forceLoad:  true,
        onSuccess:  function(content) {

        	if(!content.hasOwnProperty('basic')) {
        		throw new Error('cards.json does not have a "basic" card set');
        	}

        	for (var i = 0; i < content.basic.length; ++i) {

        		var item = content.basic[i];

        		//check for valid structure
        		if (!item.hasOwnProperty('id') || !item.hasOwnProperty('name') || !item.hasOwnProperty('level') || !item.hasOwnProperty('strength')) {
        			throw new Error ('The cards.json document is not formed properly with all required card properties.');
        		}

        		byid[item.id] = item;
        		byname[item.name] = item;
            	
            	if (!type.is(bylevel[item.level], Array)) {
                    bylevel[item.level] = [];
                }
                bylevel[item.level].push(item);

                if (!type.is(bystren[item.strength], Array)) {
                    bystren[item.strength] = [];
                }
                bystren[item.strength].push(item);
            }

            data.setCache({
                items: [
                    {
                        key: CardService.CACHENAMES.ID,
                        content: byid
                    },
                    {
                        key: CardService.CACHENAMES.NAME,
                        content: byname
                    },
                    {
                        key: CardService.CACHENAMES.STRENGTH,
                        content: bystren
                    },
                    {
                        key: CardService.CACHENAMES.LEVEL,
                        content: bylevel
                    }
                ],
                callback: function() {
                    if (callback) callback();
                }
            });
        },
        onError: function(error) {
            throw new Error(error);     //throw hard exception when we cannot retrieve the card data from its source, the application cannot function any further
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
CardService.getRandomCardIdsByLevel = function(level, callback, unique) {
	
    var results = [];
    unique      = unique || false;

    if (!type.is(level, Array)) {
        level = [level];
    }

    //load card id hash from cache.
    data.getCache(CardService.CACHENAMES.LEVEL, function(content) {

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
            CardService.load(function() {
                me.getRandomCardIdsByLevel(level, callback, unique);
            });
        }
    });
};

CardService.getCardsById = function (cardIds, callback) {
    
    var results     = {};

    if (!type.is(cardIds, Array)) {
        cardIds = [cardIds];
    }

    //load card id hash from cache.
    data.getCache(CardService.CACHENAMES.ID, function(content) {
        if (content) {
            
            var i = 0;
            for (i; i < cardIds.length; ++i) {
                if (content.hasOwnProperty(cardIds[i])) {
                    results[cardIds[i]] = content[cardIds[i]];
                } else {
                    results[cardIds[i]] = null;
                }
            }
            callback(results);
            return;
        } 
        //if not in cache, load from source and try again
        else {
            CardService.load(function() {
                me.getCardsById(cardIds, callback);
            });
        }
    });
    
};

CardService.getCardMap = function(type, callback) {

	type = type || CardService.CACHENAMES.ID;

	data.getCache(CardService.CACHENAMES[type], function(content) {
        if (content) {
        	callback(content);
        	return;
        }
        callback(null);
    });
};


module.exports = CardService;