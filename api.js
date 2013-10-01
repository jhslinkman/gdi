/*
 * API router for GDELT interactive
 */

module.exports = function() {
    var express = require('express'),
        conn = require('./database'),
        sqlCheck = require('./sqlCheck'),
        d3 = require('d3'),
        topojson = require('topojson');

    var app = express();
    

    console.log('GDELT Interactive API version 0.0.1 loaded.');

    app.get('/events/:geid', function(req, res) {
        conn.query('SELECT * FROM events WHERE globaleventid = ' + req.params.geid, function(error, result) {
            if (error) throw error;
            res.send(result.rows[0]);
        });
    });

    app.get('/subunits', function(req, res) {
        var raw = require('./data/world.json');
        res.send(topojson.feature(raw, raw.objects.world_subunits));
    });

    app.get('/events/random/:limit', function(req, res) {
        conn.query('SELECT globaleventid, actiongeo_long, actiongeo_lat, sourceurl FROM events ORDER BY random() LIMIT '
            + req.params.limit, function(error, result) {
                if (error) throw error;
                // console.log(result.rows);
                res.send(result.rows);
            });
    });

    app.get('/events', function(req, res) {
        where = [];
        for (var key in req.query) {
            if (sqlCheck(key, req.query[key])) {
                where.push(key + " = '" + req.query[key] + "'");
            }
        }
        var sql = 'SELECT globaleventid, actiongeo_long, actiongeo_lat, sourceurl, eventcode FROM events';
        if (where) {
            sql += ' WHERE ' + where.join(' AND ');
        }
        conn.query(sql, function(error, result) {
            if (error) throw error;
            res.send(result.rows);
        })
    })

    app.get('/statistics', function(req, res) {
        // var date = new Date();
        // var raw_date = date.toDateString().split(' ');
        var summaryStatistics = require('./data/20130910.summary.json');
        res.send(summaryStatistics);
    });

    app.get('/cameocodes', function(req, res) {
        var cameocodes = require('./data/cameo_codes.json');
        res.send(cameocodes);
    });

    return app
}(); // Very important to return the function call as opposed to the function