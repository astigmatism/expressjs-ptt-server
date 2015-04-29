var express = require('express');
var router = express.Router();
var Library = require('../services/library.js');

module.exports = function (app) {

	app.get('/', function (req, res) {
        
		//var library = new Library();

    	//library.getCardsById([100,101, 102, 103, 104], function(cards) {

        res.render('index', { 
            user : req.user 


        });
    });
};
