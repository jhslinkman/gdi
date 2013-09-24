define(['underscore', 'backbone'], function(_, Backbone) {

    var GDELTQuery = Backbone.Model.extend({
        defaults: {
            eventrootcode: '00',
            eventbasecode: '000',
            eventcode: '0000',
        },

        query: function(callback) {
            if (typeof callback === 'undefined') {throw new Error('GDELTQuery.query() requires a callback.')}
            var sql = 'api/selectrandom/1000';
            $.get(sql, callback);
        }
    });

    return GDELTQuery;

});