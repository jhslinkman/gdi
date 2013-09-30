
/*
 * GET home page.
 */

var createWorld = require('../gdelt_d3/createWorld');

exports.index = function(req, res) {
    res.render('index', {} );
};


/*
 * GET about page.
 */

exports.about = function(req, res) {
    res.render('about', {} );
};