define(['jquery', 'underscore', 'backbone', 'text!../../templates/mapview_template.html'],
function($, _, Backbone, mapview_template) {
    var MapView = Backbone.View.extend({
        el: '#reload',
        events: {
            "click": "reload"
        },

        initialize: function(drawing) {
            this.drawing = drawing;
        },

        reload: function() {this.drawing.draw_events();}

    })
    return MapView;
});