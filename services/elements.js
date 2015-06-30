var config = require('../config.js');
var data = require('../models/data.js');

ElementService = function() {

};

ElementService.CACHENAMES = {
	ID: 		'ElementServiceMap_Id',
	NAME: 		'ElementServiceMap_Name'
};

ElementService.load = function(callback) {
	
	var byid 	= {};
	var byname 	= {};

	data.getFile({
        path:       '/docs/elements.json',
        forceLoad:  true,
        onSuccess:  function(content) {

            if(!content.hasOwnProperty('basic')) {
                throw new Error('elements.json does not have a "basic" element set');
            }

            for (var i = 0; i < content.basic.length; ++i) {

                var item = content.basic[i];

                //check for valid structure
                if (!item.hasOwnProperty('id') || !item.hasOwnProperty('name')) {
                    throw new Error ('The cards.json document is not formed properly with all required card properties.');
                }

                byid[item.id] = item;
                byname[item.name] = item;
            };

            data.setCache({
                items: [
                    {
                        key: ElementService.CACHENAMES.ID,
                        content: byid
                    },
                    {
                        key: ElementService.CACHENAMES.NAME,
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

ElementService.getElementMap = function(type, callback) {

	type = type || ElementService.CACHENAMES.ID;

	data.getCache(ElementService.CACHENAMES[type], function(content) {
        if (content) {
        	callback(content);
        	return;
        }
        callback(null);
    });
};


module.exports = ElementService;