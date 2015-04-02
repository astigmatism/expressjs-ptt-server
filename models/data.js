/**
 * Data abstraction layer
 */

var NodeCache = require('node-cache');
var fs = require('fs');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/puretripletriad');
var config = require('../config.js');
var type = require('type-of-is');
var async = require('async');

var nodecache = new NodeCache({ 
    stdTTL: 100, 
    checkperiod: 120 
});

/**
 * Load the contents of a file and perhaps cache the contents as well
 * @param  {Object} Options include:
 *  path:
 *  cacheLifetime:
 *  forceLoad:
 *  callback:
 * @return {Object|null}
 */
exports.getFile = function(options) {

    var path            = options.path;
    var errorCallback   = options.onError;
    var successCallback = options.onSuccess;
    var cacheLifetime   = options.cacheLifetime || 0;       //how long should this file's content persist in cache? 0 = forever, -1 = don't put in cache at all
    var forceLoad       = options.forceLoad || false;       //ignore cache attempt and load data from source

    //attempt to retireve file contents. cachekey is file path
    memcached.get(path, function(err, data) {

        if (err) {
            errorCallback(err);
            return;
        }

        //if successful cache hit and we're not forcing to load data from source
        if (data && !forceLoad) {
            successCallback(data);
            return;
        }

        var fullPath = __dirname + '/..' + path;

        //no successful cache hit, find in file system and add to cache
        fs.readFile(fullPath, 'utf8', function(err, content) {
            
            if (err) {
                errorCallback(err);
                return;
            }

            //JSON parse file contents, comes in as string
            try {
                content = JSON.parse(content);
            } catch (e) {
                errorCallback(e);
                return;
            }

            console.info('File system get success: ' + fullPath);
            
            nodecache.set(path, content, cacheLifetime);

            successCallback(content);        
        });
    });
};

/**
 * get content from cache
 * @param  {Object} options
 *         key:         Array/String
 *         callback:    Function
 * @return {Object}     the object map with key content pairs. If key not found or error, value is returned as null         
 */
exports.getCache = getCache = function(options) {
    
    //required params
    var keys            = options.keys || options.key;
    var callback        = options.callback;
    //scoped
    var results         = {};

    if (!type.is(keys, Array)) {
        keys = [keys];
    }

    async.eachSeries(keys, function(key, next) {

        memcached.get(key, function(err, data) {
            if (err || data === undefined) {
                console.error(err || 'Memcached error: the key ' + key + ' is not defined');
                results[key] = null;
                next();
            } else {
                console.info('Memcached get success: ' + key);
                results[key] = data;
                next(); // next item in series
            }
        });
    }, 
    // Final callback after each item has been iterated over.
    function() {
        callback(results);
    });
};

/**
 * set content in cache
 * @param {Object} options 
 *        callback:     Function (optional)
 *        items: [      Object/Array
 *        {
 *            key: to key to this cache to retrieve later
 *            content: the content to cache
 *            cacheLifetime: (optional) -1 is don't cache, default is 0 (forever)
 *        },
 *        ]
 */
exports.setCache = setCache = function(options) {
    
    //required params
    var items           = options.items;          //map with keys and content
    //optional params
    var callback        = options.callback;

    if (!type.is(items, Array)) {
        items = [items];
    }

    async.eachSeries(items, function(item, next) {

        var cacheLifetime = item.cacheLifetime || 0;    //if cacheLifetime not set, 0 = forever

        if (cacheLifetime === -1) {
            next();            
        } else {

            memcached.set(item.key, item.content, cacheLifetime, function (err) {
                if (err) {
                    console.error(err);
                }
                console.info('Memcached set success: ' + item.key);
                next();
            });
        }
    }, 
    // Final callback after each item has been iterated over.
    function() {
        if (callback) callback();
    });
};

// exports.removeCache = removeCache = function(cachekey) {
//     memcached.del(cachekey, function(err) {
//         if (err) {
//             throw err;
//         }
//         console.info('Memcached del success. ' + cachekey);
//     });
// };