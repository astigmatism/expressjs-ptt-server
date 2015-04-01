/**
 * Library
 */

var config = require('../config.js');
var data = require('../models/data.js');

/**
 * Library constructor
 * @param {Object}
 * 	forceLoad: {Boolean} should the library's data be loaded directly from its source (true) or is cache okay? (false, default)
 */
function Library(options) {

	//params
	var forceLoad 		= options.forceLoad || false;
	var callback 		= options.callback;
	
	//members
	this._cards			= {};
	this._cardsByName	= {};

	//scoped
	var me 				= this;

	//retrieve card data from file (or cache)
	data.getFile({
		path: 		'/docs/cards/basicset.json',
		forceLoad: 	forceLoad,
		onSuccess: 	function(content) {

			me._cards = content;

			//reconstitute the cards hash to key by name instead
			var i = 0;
			for(i; i < me._cards.length; ++i) {
				var item = this._cards[i];
				this._cardsByName[item.name] = {
					'poo': 'tinkle'
				};
			};

			callback();
		}
	});

};

Library.prototype.getCardById = function(id) {
    
    if (this._cards.hasOwnProperty(id)) {
		return this._cards[id];
	}
	return null;
};

Library.prototype.getCardByName = function(name) {
    
    if (this._cardsByName.hasOwnProperty(name)) {
		return this._cardsByName[name];
	}
	return null;
};

module.exports = Library;
