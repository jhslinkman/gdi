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
            // if (query instanceof GDELTQuery) {
            this.set('query', query);
            // } else if (typeof query !== 'undefined') {
            //     throw new Error('Must initialize with a GDELTQuery object or no object at all.');
            // } else {
            //     this.set('query', new GDELTQuery());
            // }
            this.set_projection();
            this.on('change:map_loaded', this.set_loading_state, this);
            this.on('change:events_loaded', this.set_loading_state, this);
            // this.on('request', function() {console.log('Request pending');}, this);
        },

        set_projection: function() {
            this.set('projection', d3.geo[this.get('projection_type')]().scale(this.get('scale')).translate(this.get('translate')));
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
                svg.selectAll(".subunit")
                    .data(this.get('map_data').features)
                    .enter().append("path")
                    .attr("class", 'subunit')
                    .attr("d", path);
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
        }

    });
    return Drawing;
});