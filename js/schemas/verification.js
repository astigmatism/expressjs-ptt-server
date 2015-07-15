// Load required packages
var mongoose = require('mongoose');
var uuid = require('node-uuid');

// Define our user schema
var VerificationSchema = new mongoose.Schema({
    
    userid: {
        type: mongoose.Schema.ObjectId, 
        required: true, 
        ref: 'User'
    },
    token: {
        type: String, 
        required: true
    },
    created: {
        type: Date, 
        required: true, 
        default: Date.now,
        expireAfterSeconds: 60
    }
});

VerificationSchema.pre('save', function(callback) {
    callback();
});

VerificationSchema.methods.createVerificationToken = function(callback) {
    var token = uuid.v4();
    this.set('token', token);
    this.save( function(err) {
        if (err) {
            return callback(err);
        }
        return callback(null, token);
    });
};

// Export the Mongoose model
module.exports = mongoose.model('Verification', VerificationSchema);
