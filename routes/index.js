var express = require('express');
var router = express.Router();
var Library = require('../services/library.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    
    var library = new Library();

    library.getCardsById([100,101, 102, 103, 104], function(cards) {

        console.info(cards);

        res.render('index', { title: 'Express' });
    });

    //res.render('index', { title: 'Express' });
    
});

module.exports = router;
