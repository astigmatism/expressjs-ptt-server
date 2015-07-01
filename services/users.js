var type = require('type-of-is');
var async = require('async');

var CardService = require('../services/cards');
var UserStore = require('../schemas/user');
var VerificationStore = require('../schemas/verification');

UserService = function() {

};

UserService.createAccount = function(username, password, email, callback) {

    var user = new UserStore({
        username: username,
        password: password,
        email: email
    });

    user.save(function(err) {
        
        if (err) {
            return callback(err);
        }

        var verification = VerificationStore({
            userid: user._id
        });
        verification.createVerificationToken(function (err, token) {

            if (err) {
                return callback(err);
            }

            return callback(null, token);
        });
    });
};

UserService.removeAccount = function(userid, callback) {

	UserStore.remove({ _id: userid }, function(err) {
        return callback(err);
    });
};

UserService.getUserById = function(userid, callback) {

	UserStore.find({_id: userid }, function(err, result) {
        return callback(err, result);
    });
};

UserService.getUserByName = function(username, callback) {

	UserStore.find({username: username }, function(err, result) {
        return callback(err, result);
    });
};

UserService.giveCardsToUser = function(userid, manifest, callback) {

    if (!type.is(manifest, Array)) {
        manifest = [manifest];
    }

    console.log(CardService);

    //for each card in the manifest
    async.eachSeries(manifest, function(item, next) {

        //bail if no cardid
        if (!item.hasOwnProperty('cardid')) {
            next({
                message: 'missing parameters for cardid'
            }); 
        }

        console.log(CardService);

        //ensure the cardid exists in the cardid map (checking a valid cardid)
        CardService.getCardMap('ID', function (map) {

            if (!map.hasOwnProperty(item.cardid)) {
                next({
                    message: 'The cardid was not found in the card id map'
                });
            }

            UserStore.findOne({_id: userid}, function (err, user) {

                if (err) {
                    next(err);
                }

                //add the card to the user's inventory
                user.cards.push(item);

                user.save(function (err) {

                    if (err) {
                        next(err);
                    }
                    next();
                });
            });

        });
    }, 
    function(err) {
        return callback(err);
    });
};

UserService.tokenVerification = function(token, callback) {

    VerificationStore.findOne({token: token}, function (err, tokenRecord){
        if (err) {
            return callback(err);
        }

        UserStore.findOne({_id: tokenRecord.userid}, function (err, user) {
            if (err) {
                return callback(err);
            }

            //set verified to true for this user
            user.verified = true;               

            user.save(function(err) {

                if (err) {
                    return callback(err);
                }

                //remove the token from the verification store
                tokenRecord.remove();
                tokenRecord.save(function(err) {

                    if (err) {
                        return callback(err);
                    }

                    UserService.giveRandomLevelCardsToUser(user._id, [1, 1, 1, 2, 2], 'Starting Card', function(err) {

                        if (err) {
                            return callback(err);
                        }
                        return callback();
                    });
                });
            });
        })
    })
};

module.exports = UserService;