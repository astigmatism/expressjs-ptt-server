// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var UserRecord = require('../schemas/user');

/**
 * Authentication controller.
 */
AuthenticationController = function() {
};

passport.use('basic', new BasicStrategy(
    function(username, password, callback) {
        UserRecord.findOne({
            username: username
        }, function(err, user) {
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

passport.use('verified', new BasicStrategy(
    function(username, password, callback) {
        UserRecord.findOne({
            username: username
        }, function(err, user) {
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

                if (!user.isVerified()) {
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

        UserRecord.findOne({
            username: username
        }, function(err, user) {
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

                if (!user.isVerified()) {
                    return callback(null, false);
                }

                //make sure they have admin rights
                if (user.adminlevel >= req.params.adminlevel) {
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

AuthenticationController.isAuthenticatedAndVerified = passport.authenticate('verified', {
    session : false
});

/**
 * Sets request param to admin level 1 before passport authentication for checking against user later
 * @param  {Object}   req
 * @param  {Object}   res
 * @param  {Function} next
 * @return {undefined}
 */
AuthenticationController.adminLevel1Requied = function(req, res, next) {

    req.params.adminlevel = 1; //by forcing this value here a user has no direct control over this param value in a send request

    passport.authenticate('admin', {
        session : false
    })(req, res, next);
};

/**
 * Sets request param to admin level 10 before passport auth
 * @param  {Object}   req
 * @param  {Object}   res
 * @param  {Function} next [description]
 * @return {undefined}
 */
AuthenticationController.adminLevel10Requied = function(req, res, next) {

    req.params.adminlevel = 10; //by forcing this value here a user has no direct control over this param value in a send request

    passport.authenticate('admin', {
        session : false
    })(req, res, next);
};

module.exports = AuthenticationController;
