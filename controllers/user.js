/**
 *
 * The User Controller acts as a delegate all incoming requests and outgoing responses as it relates to functionality associated with 
 * user's in general. This functionality differs from the User Model which is an instance of a user object from the mongo db.
 * 
 */

var User            = require('../models/user');
var UserService     = require('../services/users');

UserController = function() {

};

//ADMIN API's

UserController.viewAccount = function(req, res) {
    
    var username    = req.body.username;
    
    if (!username) {
        return res.json({
            success: false,
            error: 'username param required in url'
        }); 
    }

    
};

UserController.giveRandomLevelCardToUser = function(req, res) {

    var userid  = req.body.userid; 
    var level   = req.body.level;

    if (!level) {
        return res.json({
            success: false,
            error: 'level param required in postdata'
        }); 
    }

    UserService.giveRandomLevelCardToUser(userid, level, function (err) {

        return res.json({
            success: true,
            card: card
        });
    });
};

//AUTHENICATED USER API's

UserController.deleteAccount = function(req, res) {

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

//UNAUTHENTICATED API's

UserController.newAccount = function(req, res) {
    
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
        return res.json({
            success: false,
            error: 'username or password not supplied in POST data'
        });
    }

    UserService.create(username, password, function(err) {
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

module.exports = UserController;