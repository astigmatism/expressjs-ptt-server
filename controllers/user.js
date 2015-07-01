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
    
    var username    = req.params.username;
    
    if (!username) {
        return res.json({
            success: false,
            error: {
                message: 'a username was not included in the params'
            }
        }); 
    }

    UserService.getUserByName(username, function(err, result) {

        if (err) {
            return res.json({
                success: false,
                error: err
            });
        }

        return res.json({
            success: true,
            user: result[0]
        });
    });
    
};

//AUTHENICATED USER API's

UserController.removeAccount = function(req, res) {

    var user = new User(req.user);

    user.removeAccount(function(err) {

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

UserController.createAccount = function(req, res) {
    
    var username    = req.body.username;
    var password    = req.body.password;
    var email       = req.body.email;

    if (!username || !password || !email) {
        return res.json({
            success: false,
            error: {
                message: 'post data missing more username, password or email'
            }
        });
    }

    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (!re.test(email)) {
        return res.json({
            success: false,
            error: {
                message: 'improperly formatted email address'
            }
        });
    }

    UserService.createAccount(username, password, email, function(err, validationtoken) {
        if (err) {
            return res.json({
                success: false,
                error: err
            });
        }

        return res.json({
            success: true,
            token: validationtoken
        });
    });
};

UserController.tokenVerification = function(req, res) {

    var token       = req.params.token;

    if (!token) {
        return res.json({
            success: false,
            error: {
                message: 'a token was not included in the params'
            }
        }); 
    }

    UserService.tokenVerification(token, function (err) {
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

module.exports = UserController;