define(['underscore', 'backbone'], function(_, Backbone) {

    var GDELTQuery = Backbone.Model.extend({

        query: function(callback) {
            if (typeof callback === 'undefined') {throw new Error('GDELTQuery.query() requires a callback.')}
            var q = this.constructQueryString();
            if (q) {
                $.get('api/events?' + q, callback);
            } else {
                $.get('api/events/random/1000', callback)
            }
        },

        constructQueryString: function() {
            if (this.attributes.hasOwnProperty('eventcode')) {
                var attrs = _.omit(this.attributes, 'eventrootcode', 'eventbasecode');
            } else if (this.attributes.hasOwnProperty('eventbasecode')) {
                var attrs = _.omit(this.attributes, 'eventrootcode');
            } else {
                var attrs = this.attributes;
            }
            var qArray = [];
            for (key in attrs) {
                qArray.push(key + '=' + attrs[key]);
            }
            return qArray.join('&');
        }
    });

    return GDELTQuery;

});