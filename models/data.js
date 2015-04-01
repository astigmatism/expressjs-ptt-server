/**
 * Data abstraction layer
 */

var Memcached = require('memcached');
var fs = require('fs');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/puretripletriad');
var config = require('../config.js');
var type = require('type-of-is');

var memcached = new Memcached('localhost:11211', {
    retries: 10,
    retry: 10000
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
    var cacheLifetime   = options.cacheLifetime || 0;       //how long should this file's content persist in cache? 0 = forever, -1 = don't put in cache at all
    var forceLoad       = options.forceLoad || false;       //ignore cache attempt and load data from source
    var errorCallback   = options.onError;
    var successCallback = options.onSuccess;

    //attempt to retireve file contents. cachekey is file path
    memcached.get(path, function(err, data) {

        if (err) {
            errorCallback(err);
            return;
        }

        //if successful cache hit and we're not forcing to load data from source
        if (data && !forceLoad) {
            console.info('Memcached get success. ' + path);
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

            //set cache
            try {
                setCache(path, content, cacheLifetime);
            } catch (e) {
                errorCallback(e);
                return;
            }

            successCallback(content);        
        });
    });
};

exports.getCache = getCache = function(cachekey, callback) {
    
    memcached.get(cachekey, function(err, data) {
        if (err) {
            throw err;
        }
        console.info('Memcached get success. ' + cachekey);
        callback(data);
    });
};

exports.setCache = setCache = function(cachekey, content, cacheLifetime) {
        
    cacheLifetime = cacheLifetime || 0; //if not defined, 0 = never expire

    if (cacheLifetime > -1) {
        memcached.set(cachekey, content, cacheLifetime, function (err) {
            if (err) {
                throw err;
            }
            console.info('Memcached set success. ' + cachekey);
        });
    }
};

exports.removeCache = removeCache = function(cachekey) {
    memcached.del(cachekey, function(err) {
        if (err) {
            throw err;
        }
        console.info('Memcached del success. ' + cachekey);
    });
};