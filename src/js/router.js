var express = require('express');
var router = express.Router();

var CardService = require('./services/cards.js');
var RuleService = require('./services/rules.js');
var ElementService = require('./services/elements.js');

var AuthenticationController = require('./controllers/authentication');
var UserController = require('./controllers/user');


module.exports = function(app){


    //NO AUTH

    router.route('/user/new').post(UserController.createAccount);

    router.route('/user/verify/:token').get(UserController.tokenVerification);




    //AUTH

    router.route('/user/').delete(AuthenticationController.isAuthenticated, UserController.removeAccount);




    //AUTH AND VERIFIED

    router.route('/cards/').get(AuthenticationController.isAuthenticatedAndVerified, UserController.getCards);

    router.route('/cards/lastused').get(AuthenticationController.isAuthenticatedAndVerified, UserController.getLastUsed);



	
    //ADMIN LEVEL 1

    router.route('/user/:username').get(AuthenticationController.adminLevel1Requied, UserController.getUser);

    //ADMIN LEVEL 10

    router.route('/cards/givelevel').post(AuthenticationController.adminLevel10Requied, UserController.giveRandomLevelCardToUser);


    app.use('/', router);


};
