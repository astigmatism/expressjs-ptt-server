/**
 *
 * The User Controller acts as a delegate all incoming requests and outgoing responses as it relates to functionality associated with 
 * user's in general. This functionality differs from the User Model which is an instance of a user object from the mongo db.
 * 
 */

var User            = require('../models/user');
var UserService     = require('../services/users');
var ErrorController = require('../controllers/error');

UserController = function() {

};

//ADMIN API's

UserController.getUser = function(req, res) {
    
    var username    = req.params.username;
    
    if (!username) {
        return res.json(ErrorController.missingParameters('username')); 
    }

    UserService.getUserByName(username, function(err, result) {

        if (err) {
            return res.json(ErrorController.error(err));
        }

        return res.json({
            success: true,
            user: result
        });
    });
    
};

UserController.removeCard = function(req, res) {

    var cardid    = req.params.cardid;
    
    if (!cardid) {
        return res.json(ErrorController.missingParameters('cardid'));
    }
};

UserController.giveRandomLevelCardToUser = function(req, res) {

    var username  = req.body.username; 
    var level   = req.body.level;
    var notes   = req.body.notes || '';

    if (!level || !username) {
        return res.json(ErrorController.missingFormData('level or username')); 
    }

    UserService.getUserByName(username, function(err, user) {

        if (err) {
            return res.json(ErrorController.error(err));
        }

        UserService.giveRandomLevelCardsToUser(user._id, level, notes, function (err, cardids) {

            if (err) {
                return res.json(ErrorController.error(err));
            }

            return res.json({
                success: true,
                cardids: cardids
            });
        });
    });
};

//AUTHENICATED USER API's

UserController.removeAccount = function(req, res) {

    var user = new User(req.user);

    user.removeAccount(function(err) {

        if (err) {
            return res.json(ErrorController.error(err));
        }

        return res.json({
            success: true
        });
    });
};

UserController.getCards = function(req, res) {
    
    var user = new User(req.user);

    user.getCards(function(err, cards) {
        if (err) {
            return res.json(ErrorController.error(err));
        }

        return res.json({
            success: true,
            cards: cards
        });
    });
};

UserController.getLastUsed = function(req, res) {

    var user = new User(req.user);

    user.getCards(function(err, cards) {
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
    }, 'lastUsed');
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

    var token = req.params.token;

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