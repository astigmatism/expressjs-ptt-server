// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var GameSchema = new mongoose.Schema({
    
    /**
     * The maximum number of players needed to begin this game. 
     * When a player begins a multiplayer game, they invite friends. This value is set to the number of players invited with the current player.
     * Player's that have accepted to join are added to the array below and their "ingame" status is true (hand locked until finished)
     * @type {Number}
     */
    maxplayers: Number      
    
    /**
     * The player's which are actively involved in this game. If they were invited, they are added here only after accepting the invition.
     * @type {Array}
     */
    players: [{
        userid: String,
        score: Number           //score can be derivied by counting captures and hand, but this is handy data
        gamehand: [String]          //an array of ??. this begins as user owned but in the case of sudden death matches, the hand could be refilled with cards which are not their own
    }],

    /**
     * The userid of the player whose turn it is
     * @type {String}
     */
    playerturn: String,

    /**
     * array of active rules referenced by their id
     * @type {Array|Number}
     */
    rules: [Number],

    /**
     * if normal gameplay is over, this boolean tells us if the game is in sudden death
     * @type {[type]}
     */
    insuddendeath: Boolean,
    elementbonus: Number,
    board: [{
        element: {
            type: Number,
            default: -1
        },    
        cardid: String,     //card id 
        captured: String    //user id who has captured
    }]

});

// Export the Mongoose model
module.exports = mongoose.model('Game', GameSchema);