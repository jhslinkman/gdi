/*
 * API router for GDELT interactive
 */

module.exports = function() {
    var express = require('express'),
        conn = require('./database'),
        d3 = require('d3'),
        topojson = require('topojson');

    var app = express();
    

    console.log('GDELT Interactive API version 0.0.1 loaded.');

    app.get('/select/:geid', function(req, res) {
        conn.query('SELECT * FROM events WHERE globaleventid = ' + req.params.geid, function(error, result) {
            if (error) throw error;
            res.send(result.rows[0]);
        });
    });

    app.get('/subunits', function(req, res) {
        var raw = require('./data/world.json');
        return res.send(topojson.feature(raw, raw.objects.world_subunits));
    });

    app.get('/data/:limit', function(req, res) {
        conn.query('SELECT globaleventid, actiongeo_long, actiongeo_lat, sourceurl FROM events ORDER BY random() LIMIT '
            + req.params.limit, function(error, result) {
                if (error) throw error;
                // console.log(result.rows);
                res.send(result.rows);
            });
    });

    return app
}(); // Very important to return the function call as opposed to the function