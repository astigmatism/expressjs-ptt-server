// Load required packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// Define our user schema
var UserSchema = new mongoose.Schema({
    
    /**
     * The username for the player, will be unique
     * @type {Object}
     */
    username: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    /**
     * Has this user validated their email address by following the verification link?
     * @type {Boolean}
     */
    verified: {
        type: Boolean,
        default: false
    },

    /**
     * The date this account was created
     * @type {Date}
     */
    created: {
        type: Date,
        default: Date.now
    },

    /**
     * is this user an admin
     * @type {Boolean}
     * @default 0 no rights granted
     */
    adminlevel: {
        type: Number,
        default: 0
    },

    /**
     * The sum of all game wins for this player
     * @type {Number}
     */
    wins: {
    	type: Number,
    	default: 0
    },

    /**
     * The sum of all game losses for this player
     * @type {Number}
     */
    loses: {
    	type: Number,
    	default: 0
    },

    /**
     * The sum of all draw game results for this player
     * @type {Number}
     */
    draws: {
    	type: Number,
    	default: 0
    },

    /**
     * user's owned cards
     * @type {Array|Object}
     */
    cards: [
        {
            //_id                   //the unique if this card in mongo, use for db CRUD
            cardid: Number,         //the card id which maps to the card library
            //the date obtained
            obtained: {
                type: Date,         
                default: Date.now
            },
            //the game id (in mongo) for the game this card is currently participating in. empty string for no game
            ingame: {
                type: String,
                default: ''
            },
            notes: String,          //any notes about the card itself, usually obtain information (like from a game, etc)
            //a sum of the number of captures this card has been responsible for ;)
            captures: {
                type: Number,
                default: 0
            },
            // a sum of the number of times this card was captured by another player in a game
            taken: {
                type: Number,
                default: 0
            },
            // was this card used in the last game? We'll use this info to present a default hand to the player before a game
            lastUsed: Boolean
        }
    ]
});

// Execute before each user.save() call
UserSchema.pre('save', function(callback) {
    var user = this;

    // Break out if the password hasn't changed
    if (!user.isModified('password')) {
        return callback();
    }

    // Password changed so we need to hash it
    bcrypt.genSalt(5, function(err, salt) {
        if (err) {
            return callback(err);
        }

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) {
                return callback(err);
            }
            user.password = hash;
            callback();
        });
    });
});

UserSchema.methods.verifyPassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};

UserSchema.methods.isVerified = function() {
    return this.verified;
};

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);