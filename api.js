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
        res.send(topojson.feature(raw, raw.objects.world_subunits));
    });

    app.get('/data/:limit', function(req, res) {
        conn.query('SELECT globaleventid, actiongeo_long, actiongeo_lat, sourceurl FROM events ORDER BY random() LIMIT '
            + req.params.limit, function(error, result) {
                if (error) throw error;
                // console.log(result.rows);
                res.send(result.rows);
            });
    });

    app.get('/selectall/eventrootcode/:value', function(req, res) {
        conn.query('SELECT globaleventid, actiongeo_long, actiongeo_lat, sourceurl, eventcode FROM events WHERE eventrootcode = '
            + "'" + req.params.value + "'", function(error, result) {
                if (error) throw error;
                res.send(result.rows);
            });
    });


    app.get('/cameocodes', function(req, res) {
        var cameocodes = require('./data/cameo_codes.json');
        res.send(cameocodes);
    });

    return app
}(); // Very important to return the function call as opposed to the function