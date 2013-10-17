define(['d3', 'fitProjection'], function(d3, fitProjection) {
    function Map(options) {
          var defaults = {
              projectionType: 'conicEquidistant',
              map: 'subunits',
              svgId: '#svg',
              el: '#map',
              focus: null
          }
          for (var key in defaults) {
              if (typeof options !== 'undefined') {
                  this[key] = options[key] ? options[key] : defaults[key];
              } else {
                  this[key] = defaults[key];
              }
          }
          this.setSvgAttrs();
    }

    // Map.prototype.fitProjection = function() {
    //     fitProjection(this.projection(), this.data, [[leftMargin, 60], [width - 20, height-120]], true);
    // }

    Map.prototype.setSvgAttrs = function() {
        var svg = d3.select(this.svgId);
        this.width = svg.attr('width');
        this.height = svg.attr('height');
        this.scale = 150;
    }

    Map.prototype.projection = function(_this) {
        _this = _this || this;
        return d3.geo[_this.projectionType]().translate([_this.width / 2, _this.height / 2]).scale(_this.scale);
    }

    Map.prototype.get = function(callback) {
        var _this = this;
        d3.json('api/' + this.map, function(d) {
            _this.data = d;
            if (typeof callback !== 'undefined') callback(_this);
        });
    }

    Map.prototype.draw = function(_this) {
        _this = _this || this;
        if (_this.data === null) {throw new Error('Map data not defined.');}
        var path = d3.geo.path()
                     .projection(_this.projection(_this));
        var svg = d3.select('#map');
        svg.select("path").remove();
        svg.selectAll('.country').remove();
        svg.append("path")
            .datum(_this.data)
            .attr("d", path);
        svg.selectAll(".country")
            .data(_this.data.features)
            .enter().append("path")
            .attr("class", 'country')
            .attr("id", function(d) { return d.id; })
            .attr("d", path)
            .append('svg:title').text(function(d) { return d.properties.name; });
    }

    Map.prototype.show = function() {
        d3.select(this.el).style('display', 'block');
    }

    Map.prototype.hide = function() {
        d3.select(this.el).style('display', 'none');
    }

    Map.prototype.rotate = function(lon, lat, x, y) {
        if (this.projectionType === 'conicEquidistant') {
            return [lon/2, x, y].join(' ');
        } else if (this.projectionType === 'equirectangular') {
            return [0, x, y].join(' ');
        } else {
            throw new Error('Cannot calculate rotation for projection: ' + this.projectionType)
        }
    }

    Map.prototype.zoom = function(cId) {
        var x, y, k;
        var c = d3.select('#' + cId);
        var projection = this.projection();
        var paths = d3.selectAll('path');
        if (this.focus !== cId && c[0][0] !== null) {
            var path = d3.geo.path()
                         .projection(projection);
            var centroid = path.centroid(c.data()[0]);
            x = centroid[0];
            y = centroid[1];
            var lonLat = projection.invert(centroid);
            var rotate = this.rotate(lonLat[0], lonLat[1], x, y);
            k = 5;
            this.focus = cId;
            paths.transition().duration(750)
                .attr("transform", "translate(" +
                    this.width / 2 + "," + this.height / 2 +
                ")scale(" +
                    k +
                ")translate(" +
                    -x + "," + -y +
                ")rotate(" +
                    rotate +
                ")");
            return {
                'x': x,
                'y': y,
                'scale': k,
                'rotate': rotate
            }
        } else {
            paths.transition().duration(750)
                .attr("transform", '');
            this.focus = null;
            return null;
        }
    }
    
    return Map;
});