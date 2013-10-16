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
        var whereArray = [];
        var val, vals, where;
        for (var key in req.query) {
            vals = req.query[key].split(',');
            where = [];
            for (var i = 0; i < vals.length; i++) {
                val = vals[i];
                if (sqlCheck(key, val)) {
                    where.push(val);
                }
            }
            if (where.length === 1) {
                whereArray.push(key + " = '" + where[0] + "'");
            } else if (where.length > 1) {
                whereArray.push(key + " IN ('" + where.join("', '") + "')");
            }
        }
        var sql = 'SELECT globaleventid, actiongeo_long, actiongeo_lat, sourceurl, eventcode FROM events';
        if (whereArray.length > 0) {
            sql += ' WHERE ' + whereArray.join(' AND ');
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