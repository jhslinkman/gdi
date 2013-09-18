/*
 * API router for GDELT interactive
 */

module.exports = function() {
    var express = require('express');
    var app = express();
    var conn = require('./database');

    console.log('GDELT interactive API version 0.0.1 loaded.');

    app.get('/select/:geid', function(req, res) {
        conn.query('SELECT * FROM events WHERE globaleventid = ' + req.params.geid, function(error, result) {
            if (error) throw error;
            res.send(result.rows[0]);
        });
    });

    return app
}(); // Very important to return the function call as opposed to the function