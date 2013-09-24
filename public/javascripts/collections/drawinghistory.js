define(['underscore', 'backbone', 'drawing'], function(_, Backbone, Drawing) {
    var DrawingHistory = Backbone.Collection.extend({
        model: Drawing,
    });

    return DrawingHistory;
});