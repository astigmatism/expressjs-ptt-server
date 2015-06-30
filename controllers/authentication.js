// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var UserRecord = require('../schemas/user');

AuthenticationController = function() {

};

passport.use('basic', new BasicStrategy(
    function(username, password, callback) {
        UserRecord.findOne({ username: username }, function (err, user) {
            if (err) { 
                return callback(err); 
            }

            // No user found with that username
            if (!user) { 
                return callback(null, false); 
            }

            // Make sure the password is correct
            user.verifyPassword(password, function(err, isMatch) {
                if (err) { 
                    return callback(err); 
                }

                // Password did not match
                if (!isMatch) { 
                    return callback(null, false); 
                }

                // Success
                return callback(null, user);
            });
        });
    }
));

passport.use('admin', new BasicStrategy({
        passReqToCallback: true
    },
    function(req, username, password, callback) {
        
        UserRecord.findOne({ username: username }, function (err, user) {
            if (err) { 
                return callback(err); 
            }

            // No user found with that username
            if (!user) { 
                return callback(null, false); 
            }

            // Make sure the password is correct
            user.verifyPassword(password, function(err, isMatch) {
                if (err) { 
                    return callback(err); 
                }

                // Password did not match
                if (!isMatch) { 
                    return callback(null, false);
                }

                //make sure they have admin rights
                if (user.adminlevel >= req.body.adminlevel) {
                    // Success
                    return callback(null, user);
                }

                return callback(null, false); 
            });
        });
    }
));

AuthenticationController.isAuthenticated = passport.authenticate('basic', { 
    session : false 
});

AuthenticationController.adminLevel1Requied = function(req, res, next) {
    
    req.body.adminlevel = 1;

    passport.authenticate('admin', { 
        session : false
    })(req, res, next);
};

AuthenticationController.adminLevel10Requied = function(req, res, next) {
    
    req.body.adminlevel = 10;

    passport.authenticate('admin', { 
        session : false
    })(req, res, next);
};

module.exports = AuthenticationController;
