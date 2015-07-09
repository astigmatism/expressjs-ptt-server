var config = require('../config.js');
var type = require('type-of-is');
var utils = require('../models/utils');

var DataService = require('../services/data.js');

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

	DataService.getFile('/docs/cards.json', function(err, content) {

        //throw hard exceptions when we cannot retrieve the card data from its source, the application cannot function any further
        
        if (err) {
            throw new Error(err);
        }

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

        DataService.setCache([
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
        function() {
            if (callback) {
                callback();
            }
            return;
        });

    }, true);
};

/**
 * Get a random card within a level from the set
 * @param  {Number}   level    
 * @param  {Function} callback 
 * @param  {Boolean}   unique   optional. default: false. specifies random with replacement (false) or not (true)
 * @return {[type]}            [description]
 */
CardService.getRandomCardIdsByLevel = function(level, callback, opt_unique) {
	
    var results = [];
    opt_unique      = opt_unique || false;

    if (!type.is(level, Array)) {
        level = [level];
    }

    //load card id hash from cache.
    DataService.getCache(CardService.CACHENAMES.LEVEL, function(content) {

        if (content) {
            
            var cardsbylevelpopped = {};

            var i = 0;
            for (i; i < level.length; ++i) {
                
                var currentlevel = String(level[i]);

                if (!content.hasOwnProperty(currentlevel)) {
                    return callback('No cards found for this level', null);
                }
                var cardsinlevel = content[currentlevel];

                //if unique results only, lets copy all the cards of this level and put them in the cardsByLevelPop object so we can random without replacement
                if (opt_unique) {

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
            return callback(null, results);
        } 
        //if not in cache, load from source and try again
        else {
            CardService.load(function() {
                me.getRandomCardIdsByLevel(level, callback, opt_unique);
            });
        }
    });
};

/**
 * Returns one of the card maps in cache for easy lookup without iteration. default returned is ID map
 * @param  {String}   type     ID|NAME|LEVEL|STRENGTH
 * @param  {Function} callback 
 * @return {Function}            returns null if not found in cache
 */
CardService.getCardMap = function(type, callback) {

	type = type || CardService.CACHENAMES.ID;

	DataService.getCache(CardService.CACHENAMES[type], function(content) {
        if (!content) {
        	CardService.load(function() {
                CardService.getCardMap(type, callback);
            });
            return;
        }
        return callback(content);
    });
};


module.exports = CardService;