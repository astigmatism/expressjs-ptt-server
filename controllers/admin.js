// Load required packages
var Library = require('../services/cards');
var User    = require('../models/user');
var configuration = require('../config.js');

exports.isAdmin = function(req, res) {

	var user = new User(req.user);

	if (err) {
        return res.json({
            success: false,
            error: err
        });
    }

    return res.json({
        success: true,
        cards: cards
    });
};