define(['underscore', 'backbone', 'gdeltquery'], function(_, Backbone, GDELTQuery) {
    var QueryHistory = Backbone.Collection.extend({
        model: GDELTQuery,
    });

    return QueryHistory;
});