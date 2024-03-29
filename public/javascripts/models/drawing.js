define(['underscore',
        'backbone',
        'd3',
        'gdeltquery'],
function(_, Backbone, d3, GDELTQuery) {
    var Drawing = Backbone.Model.extend({
        defaults: {

            // projection attributes
            projection_type: 'conicEquidistant',
            projection: null,
            translate: [425, 250],
            scale: 115,
            centeredCountry: null,

            map_data: null,
            map_changed: false,
            map_attrs: {},

            events: null,
            events_changed: false,
            events_attr: {
                type: 'xyplot'
            },

            map_loaded: false,
            events_loaded: false,
            loaded: false

        },

        initialize: function(query) {
            this.set('query', query);
            this.set_projection();
            this.on('change:map_loaded', this.set_loading_state, this);
            this.on('change:events_loaded', this.set_loading_state, this);
        },

        set_projection: function() {
            this.set('projection', d3.geo[this.get('projection_type')]().translate(this.get('translate')).scale(this.get('scale')));
        },

        set_map: function(callback) {
            var _this = this;
            this.set('map_loaded', false);
            $.get('api/subunits', function(data) {
                _this.set('map_data', data);
                _this.set('map_changed', true);
                _this.set('map_loaded', true);
                if (typeof callback !== 'undefined') {
                    callback();
                }
            });
        },

        draw_map: function(callback) {
            if (this.get('map_changed')) {
                if (this.get('map_data') === null) {throw new Error('Map data not defined.');}
                var path = d3.geo.path()
                             .projection(this.get('projection'));
                var svg = d3.select('#map');
                svg.append("path")
                    .datum(this.get('map_data'))
                    .attr("d", path);
                    // .attr('id', 'world_map');
                svg.selectAll(".country")
                    .data(this.get('map_data').features)
                    .enter().append("path")
                    .attr("class", 'country')
                    .attr("id", function(d) { return d.id; })
                    .attr("d", path);
                    // .on("click", this.zoom);
                this.set('map_changed', false);
            }
            if (typeof callback !== 'undefined') callback();
        },

        set_events: function(callback) {
            var _this = this;
            this.set('events_loaded', false);
            this.get('query').query(function(q) {
                _this.set('events', q);
                _this.set('events_changed', true);
                _this.set('events_loaded', true);
                if (typeof callback !== 'undefined') callback();
            });
        },

        draw_events: function(callback) {
            if (this.get('events') === null) {throw new Error('Event data not defined.');}
            if (this.get('events_changed')) {
                var projection = this.get('projection');
                var events = d3.select('#events').selectAll("cirle")
                    .data(this.get('events')).enter().append("circle")
                    .attr('r', 2)
                    .attr('class', 'event')
                    .attr('transform', function(d) {
                            return "translate(" + projection([d.actiongeo_long, d.actiongeo_lat]) + ")";
                    })
                    .attr('data-id', function(d) {
                        return d.globaleventid;
                    });
                this.set('events_changed', false);
            }
            if (typeof callback !== 'undefined') callback();
        },

        draw: function(events_callback, map_callback) {
            var _this = this;
            this.set_map(function() {
                _this.draw_map();
                if (typeof map_callback !== 'undefined') map_callback();
            });
            this.set_events(function() {
                _this.draw_events();
                if (typeof events_callback !== 'undefined') events_callback();
            })
        },

        set_loading_state: function() {
            if (this.get('map_loaded') && this.get('events_loaded')) {
                this.set('loaded', true);
            } else if (this.get('loaded')) {
                this.set('loaded', false);
            }
        },

        hide: function() {
            d3.select('#map').style('display', 'none');
            d3.select('#events').style('display', 'none');
        },

        show: function() {
            d3.select('#map').style('display', 'block');
            d3.select('#events').style('display', 'block');
        },

        zoom: function(countryId) {
            var x, y, k;
            var c = d3.select('#' + countryId);
            var projection = this.get('projection');
            var paths = d3.selectAll('path');
            var circles = d3.selectAll('circle');
            if (this.get('centeredCountry') !== countryId) {
                var path = d3.geo.path()
                             .projection(projection);
                var centroid = path.centroid(c.data()[0]);
                x = centroid[0];
                y = centroid[1];
                var lonLat = projection.invert(centroid);
                var rotate = [lonLat[0]/2, x, y].join(' ');
                k = 5;
                this.set('centeredCountry', countryId);
                paths.transition().duration(750)
                    .attr("transform", "translate(" +
                        850 / 2 + "," + 500 / 2 +
                    ")scale(" +
                        k +
                    ")translate(" +
                        -x + "," + -y +
                    ")rotate(" +
                        rotate +
                    ")");
                circles.transition().duration(750)
                    .attr("transform", function(d) {
                        return "translate(" +
                            850 / 2 + "," + 500 / 2 +
                        ")scale(" +
                            k +
                        ")translate(" +
                            -x + "," + -y +
                        ")rotate(" +
                            rotate +
                        ")translate(" +
                            projection([d.actiongeo_long, d.actiongeo_lat]) +
                        ")";
                    })
                    .attr('r', 1);
            } else {
                paths.transition().duration(750)
                    .attr("transform", '');
                    //     "translate(" +
                    //     850 / 2 + "," + 500 / 2 +
                    // ')');
                circles.transition().duration(750)
                    .attr("transform", function(d) {
                            return "translate(" + projection([d.actiongeo_long, d.actiongeo_lat]) + ")";
                    })
                    .attr('r', 2);
                this.set('centeredCountry', null);
            }
        }

    });
    return Drawing;
});