var CardService = require('../services/cards');
var UserStore = require('../schemas/user');
var VerificationStore = require('../schemas/verification');

UserService = function() {

};

UserService.createAccount = function(username, password, email, callback) {
    
    //choose the five cards this user will begin with
    //CardService.getRandomCardIdsByLevel([1, 1, 1, 1, 2], function(cardids) {

        // cards = [];
        // for (var i = 0; i < cardids.length; ++i) {
        //     cards.push({
        //         cardid: cardids[i],
        //         lastUsed: true,         //set this to true so that the game understands these are your starting cards for your first game
        //         notes: 'Starting Card'
        //     });
        // }
        // }, true);

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
        callback(err);
    });
};

UserService.getUserById = function(userid, callback) {

	UserStore.find({_id: userid }, function(err, result) {
        callback(err, result);
    });
};

UserService.getUserByName = function(username, callback) {

	UserStore.find({username: username }, function(err, result) {
        callback(err, result);
    });
};


UserService.giveRandomLevelCardToUser = function(userid, level, callback) {

	CardService.getRandomCardIdsByLevel(level, function(cardids) {

		CardService.getCardsById(cardids[0], function(card) {



			
		});
	});
};

UserService.tokenVerification = function(token, callback) {

    VerificationStore.findOne({token: token}, function (err, result){
        if (err) {
            return callback(err);
        }

        UserStore.findOne({_id: result.userid}, function (err, user) {
            if (err) {
                return callback(err);
            }

            user.verified = true;
            user.save(function(err) {
                callback(err);
            });
        })
    })
};

module.exports = UserService;