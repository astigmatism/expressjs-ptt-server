var config = require('../config.js');
var data = require('../models/data.js');

RuleService = function() {

};

RuleService.CACHENAMES = {
	ID: 		'RuleServiceMap_Id',
	NAME: 		'RuleServiceMap_Name'
};

RuleService.load = function(callback) {
	
	var byid 	= {};
	var byname 	= {};

	data.getFile({
        path:       '/docs/rules.json',
        forceLoad:  true,
        onSuccess:  function(content) {

        	if(!content.hasOwnProperty('basic')) {
        		throw new Error('rules.json does not have a "basic" rules set');
        	}

        	for (var i = 0; i < content.basic.length; ++i) {

        		var item = content.basic[i]; //rule object

        		//check for valid structure
        		if (!item.hasOwnProperty('name') || !item.hasOwnProperty('description') || !item.hasOwnProperty('id')) {
        			throw new Error ('The rules.json document is not formed properly with all rule properties.');
        		}

        		byid[item.id] = item;
        		byname[item.name] = item;
        	}

            data.setCache({
                items: [
                    {
                        key: RuleService.CACHENAMES.ID,
                        content: byid
                    },
                    {
                        key: RuleService.CACHENAMES.NAME,
                        content: byname
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

RuleService.getRuleMap = function(type, callback) {

	type = type || RuleService.CACHENAMES.ID;

	data.getCache(RuleService.CACHENAMES[type], function(content) {
        if (content) {
        	callback(content);
        	return;
        }
        callback(null);
    });
};


module.exports = RuleService;