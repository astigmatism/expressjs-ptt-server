// Load required packages
var Library = require('../services/library');
var User    = require('../models/user');

// Create endpoint /api/users for POST
exports.newUser = function(req, res) {
    
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
        return res.json({
            success: false,
            error: 'username or password not supplied in POST data'
        });
    }

    User.newUser(username, password, function(result) {
        return res.json(result);
    });
};

exports.deleteUser = function(req, res) {

    User.deleteUser(req.user, function(result) {
        return res.json(result);
    });
};

//mainly for feedback for now
exports.home = function(req, res) {
    
    User.getCards(req.user, function(result) {
        return res.json(result);
    });
};