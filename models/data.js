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
    nodecache.get(path, function(err, data) {

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

            nodecache.set(path, content, cacheLifetime, function() {
                successCallback(content);
            });
        });
    });
};

/**
 * gets data from NodeCache service
 * @param  {String|Array}   keys     The cache keys
 * @param  {Function} callback The function to return the cached data to
 * @return {Object}            
 */
exports.getCache = getCache = function(keys, callback) {

    if (!type.is(keys, Array)) {
        keys = [keys];
    }

    nodecache.get(keys, function(err, results) {
        if (err) {
            console.error(err);
            callback({});
        } else {
            console.info('NodeCache get success: ' + keys);
            
            if (keys.length > 1) {
                callback(results);
            }
            //if lookup performed on one key, return result without key
            else {
                callback(results[keys[0]]);
            }
        }
    });

};


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

            nodecache.set(item.key, item.content, cacheLifetime, function (err) {
                if (err) {
                    console.error(err);
                }
                console.info('NodeCache set success: ' + item.key);
                next();
            });
        }
    }, 
    // Final callback after each item has been iterated over.
    function() {
        if (callback) callback();
    });
};
