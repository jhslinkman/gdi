var createWorld = function() {
    var d3 = require('d3'),
        jsdom = require('jsdom'),
        topojson = require('topojson');

    var svg = d3.select('body').append('svg').attr('width', 500).attr('height', 500);

    var projection = d3.geo.albers()
                .scale(200)
                .translate([200, 200]);

    console.log(projection);

    var world = require("../data/world.json");

    var subunits = topojson.feature(world, world.objects.world_subunits);

    var path = d3.geo.path()
                 .projection(projection);

    svg.append("path")
        .datum(subunits)
        .attr("d", path);

    svg.selectAll(".subunit")
        .data(subunits.features)
        .enter().append("path")
        .attr("class", 'subunit')

    return d3.select('body').node().innerHTML
    
}

module.exports = createWorld;