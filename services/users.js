var CardService = require('../services/cards');
var UserStore = require('../schemas/user');

UserService = function() {

};

UserService.createAccount = function(username, password, callback) {
    
    //choose the five cards this user will begin with
    CardService.getRandomCardIdsByLevel([1, 1, 1, 1, 2], function(cardids) {

        cards = [];
        for (var i = 0; i < cardids.length; ++i) {
            cards.push({
                cardid: cardids[i],
                lastUsed: true,         //set this to true so that the game understands these are your starting cards for your first game
                notes: 'Starting Card'
            });
        }

        var user = new UserStore({
            username: username,
            password: password,
            cards: cards
        });

        user.save(function(err) {
            callback(err);
        });

    }, true);
};

UserService.removeAccount = function(userid, callback) {

	UserStore.remove({ _id: userid }, function(err) {
        callback(err);
    });
};

UserService.getUserById = function(userid, callback) {

	UserStore.find({_id: this._userid }, function(err, result) {
        callback(err, result);
    });
};


UserService.giveRandomLevelCardToUser = function(userid, level, callback) {

	CardService.getRandomCardIdsByLevel(level, function(cardids) {

		CardService.getCardsById(cardids[0], function(card) {



			
		});
	});
};