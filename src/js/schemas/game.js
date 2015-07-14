// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var GameSchema = new mongoose.Schema({
    
    /**
     * This game's current state
     * Here are some ideas: Waiting for players, in progress, in sudden death, waiting for player to take cards.. etc
     * @type {String}
     */
    state: String,

    /**
     * Array of user id's: players that have been invited to play in this game but have not yet joined.
     * @type {Array}
     */
    invited: [String],
    
    /**
     * The player's which are actively involved in this game. If they were invited, they are added here only after accepting the invition.
     * @type {Array}
     */
    players: [{
        userid: String,
        score: Number,           //score can be derivied by counting captures and hand, but this is handy data
        gamehand: [String]          //an array of ??. this begins as user owned but in the case of sudden death matches, the hand could be refilled with cards which are not their own
    }],

    /**
     * The userid of the player whose turn it is should this be a game with mutliple actual players
     * @type {String}
     */
    playerturn: String,

    /**
     * array of active rules referenced by their id
     * @type {Array|Number}
     */
    rules: [Number],

    /**
     * The bonus, positive or negative, the elemental tiles add/sub from non-elemental matches (usually just 1)
     * @type {[type]}
     */
    elementbonus: {
        type: Number,
        default: 1
    },

    /**
     * The game board state
     * @type {Array}
     */
    board: [{
        element: {
            type: Number,
            default: -1
        },    
        cardid: String,     //card id (from library)
        captured: String    //user id who has captured
    }]

});

// Export the Mongoose model
module.exports = mongoose.model('Game', GameSchema);