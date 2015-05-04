// Load required packages
var User = require('../models/user');
var Library = require('../services/library');

// Create endpoint /api/users for POST
exports.register = function(req, res) {
    
    //choose the five cards this user will begin with
    Library.getRandomCardIdsByLevel([1, 1, 1, 1, 2], function(cardids) {

        cards = [];
        for (var i = 0; i < cardids.length; ++i) {
            cards.push({
                id: cardids[i],
                obtained: Date(),
                ingame: false,
                notes: 'starting card'
            });
        }

        var user = new User({
            username: req.body.username,
            password: req.body.password,
            cards: cards
        });

        user.save(function(err) {
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

    }, true);
};

// Create endpoint /api/users for GET
exports.users = function(req, res) {

    Library.getRandomCardIdsByLevel([10, 9, 8], function(results) {

        return res.json(results);    
    }, true);

    

    // User.find(function(err, users) {
    //   if (err) {
    //       return res.json({
    //           success: false,
    //           error: err
    //       })
    //   }

    //   return res.json({
    //       success: true,
    //       users: users
    //   });
    // });
};