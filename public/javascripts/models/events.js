define(['d3'], function(d3) {
    function Events(map, query, options) {
        this.map = map;
        this.query = query;
        var defaults = {
            svgId: '#svg',
            g: '#events',
        }
        for (var key in defaults) {
            if (typeof options !== 'undefined') {
                this[key] = options[key] ? options[key] : defaults[key];
            } else {
                this[key] = defaults[key];
            }
        }
        var svg = d3.select(this.svgId);
        if (svg.select(this.g)[0][0] === null) {
            svg.append('g').attr('id', this.g.slice(1));
        }
    }

    Events.prototype.get = function(callback) {
        var _this = this;
        _this.query.query(function(d) {
            _this.data = d;
            if (typeof callback !== 'undefined') callback();
        })
    }

    Events.prototype.draw = function(_this) {
        _this = _this || this;
        var projection = _this.map.projection();
        d3.selectAll('.event').remove();
        var events = d3.select('#events').selectAll("cirle")
            .data(_this.data).enter().append("circle")
            .attr('r', 2)
            .attr('class', 'event')
            .attr('transform', function(d) {
                    return "translate(" + projection([d.actiongeo_long, d.actiongeo_lat]) + ")";
            })
            .attr('data-id', function(d) {
                return d.globaleventid;
            });
    }

    Events.prototype.show = function() {
        d3.select(this.g).style('display', 'block');
    }

    Events.prototype.hide = function() {
        d3.select(this.g).style('display', 'none');
    }

    Events.prototype.zoom = function(options) {
        var projection = this.map.projection();
        var events = d3.selectAll('.event');
        var _this = this;
        if (options) {
            var path = d3.geo.path()
                         .projection(projection);
            events.transition().duration(750)
                .attr("transform", function(d) {
                    return "translate(" +
                        _this.map.width / 2 + "," + _this.map.height / 2 +
                    ")scale(" +
                        options.scale +
                    ")translate(" +
                        -options.x + "," + -options.y +
                    ")rotate(" +
                        options.rotate +
                    ")translate(" +
                        projection([d.actiongeo_long, d.actiongeo_lat]) +
                    ")";
                })
                .attr('r', 1);
        } else {
            events.transition().duration(750)
                .attr("transform", function(d) {
                        return "translate(" + projection([d.actiongeo_long, d.actiongeo_lat]) + ")";
                })
                .attr('r', 2);
        }
    }
    return Events;
});