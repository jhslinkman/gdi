/*
 * Database module for GDELT interactive
 */

var anyDB = require('any-db'),
    config = require('./config');

var dbURL = 'postgres://' + config.database.user + ':'
        + config.database.password + '@' + config.database.server + ':'
        + config.database.port + '/' + config.database.name;

var conn = anyDB.createConnection(dbURL);

module.exports = conn;