// Load required packages
var Library = require('../services/library');
var User    = require('../models/user');

// Create endpoint /api/users for POST
exports.newAccount = function(req, res) {
    
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
        return res.json({
            success: false,
            error: 'username or password not supplied in POST data'
        });
    }

    User.create(username, password, function(err) {
        if (err) {
            return res.json({
                success: false,
                error: err
            });
        }

        return res.json({
            success: true,
        });
    });
};

exports.deleteAccount = function(req, res) {

    var user = new User(req.user);

    user.remove(function(err) {

        if (err) {
            return res.json({
                success: false,
                error: err
            });
        }

        return res.json({
            success: true
        });
    });
};

//mainly for feedback for now
exports.home = function(req, res) {
    
    var user = new User(req.user);

    user.mongoRecord(function(err, result) {

        if (err) {
            return res.json({
                success: false,
                error: err
            });
        }
        
        return res.json({
            success: true,
            userobject: user,
            mongo: result
        });
    });
};