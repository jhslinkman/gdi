define(['underscore', 'backbone', 'd3'], function(_, Backbone, d3) {
    var GdeltMap = Backbone.Model.extend({
        defaults: {
            focus: null,
            map_type: 'xyplot',

            projection_type: 'conicEquidistant',
            projection: null,
            translate: [425, 250],
            scale: 115,

            map: null,
            map_changed: false,

            data: null,
            data_changed: false

        },

        initialize: function(data) {
            // if (data instanceof GdeltData) {
            //     this.set('data', data);
            // } else if (typeof data !== 'undefined') {
            //     throw 'Must initialize with a GdeltData object or no object at all.';
            // } else {
            //     this.set('data', new GdeltData());
            // }
            this.set_projection();
        },

        set_projection: function(scale, translate) {
            scale = typeof scale !== 'undefined' ? scale : this.get('scale');
            translate = typeof translate !== 'undefined' ? translate: this.get('translate');
            this.set('projection', d3.geo[this.get('projection_type')]().scale(scale).translate(translate));
        },

        set_map: function(callback) {
            var _this = this;
            $.get('api/subunits', function(data) {
                _this.set('map', data);
                _this.set('map_changed', true);
                if (typeof callback !== 'undefined') {
                    callback();
                }
            });
        },

        draw_map: function(callback) {
            if (this.get('map_changed')) {
                var path = d3.geo.path()
                             .projection(this.get('projection'));
                var svg = d3.select('svg');
                svg.append("path")
                    .datum(this.get('map'))
                    .attr("d", path);
                    // .attr('id', 'world_map');
                svg.selectAll(".subunit")
                    .data(this.get('map').features)
                    .enter().append("path")
                    .attr("class", 'subunit')
                    .attr("d", path);
                this.set('map_changed', false);
            }
            if (typeof callback !== 'undefined') callback();
        },

        set_data: function(query_list, callback) {
            var _this = this;
            var sql = 'api/' + query_list.join('/');
            $.get(sql, function(data) {
                  _this.set('data', data);
                  _this.set('data_changed', true);
                  if (typeof callback !== 'undefined') {
                      callback();
                  }
            });
        },

        draw_data: function(callback) {
            if (this.get('data_changed')) {
                var projection = this.get('projection');
                d3.select('svg').selectAll("event")
                    .data(this.get('data')).enter().append("event")
                    .attr('r', 2)
                    .attr('class', 'event')
                    .attr('transform', function(d) {
                            return "translate(" + projection([d.actiongeo_long, d.actiongeo_lat]) + ")";
                    });
                this.set('data_changed', false);
            }
            if (typeof callback !== 'undefined') callback();
        }
    });
    return GdeltMap;
});