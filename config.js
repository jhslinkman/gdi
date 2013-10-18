/*
 *  Configuration settings for GDELT interactive
 */

var config = {};

config.dburl = process.env.HEROKU_POSTGRESQL_IVORY_URL;

module.exports = config;
