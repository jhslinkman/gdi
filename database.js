/*
 * Database module for GDELT interactive
 */

var anyDB = require('any-db'),
    app = require('express')(),
    config,
    dbURL;

if ('development' === app.get('env')) {
    config = require('./devConfig');
} else {
    config = require('./config');
}

if (config.dburl) {
    dbURL = config.dburl;
} else {
    dbURL = 'postgres://' + config.database.user + ':'
        + config.database.password + '@' + config.database.server + ':'
        + config.database.port + '/' + config.database.name;
}

var conn = anyDB.createConnection(dbURL);

module.exports = conn;