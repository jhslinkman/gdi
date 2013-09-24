define(['jquery', 'underscore', 'backbone', 'text!../../templates/mapview_template.html'],
function($,        _,            Backbone, mapview_template) {
    var MapView = Backbone.View.extend({
        el: '#view',
        template: mapview_template,
        initialize: function() {
            this.render();
        },
        render: function() {
            this.$el.html(mapview_template);
            return this;
        }
    })
    return MapView;
});