define(['jquery',
        'underscore',
        'backbone',
        'd3',
        'eventview',
        'gdeltevent',
        'eventmodal'],
function($, _, Backbone, d3,
         EventView, GDELTEvent, EventModal) {

    var SVGView = Backbone.View.extend({
        el: '#svg',

        initialize: function(events) {
            this.events = events;
            this.$('#events').on('click', '.event', function(e) {
                e.stopPropagation();
                var gdeltEvent = new GDELTEvent({id: e.target.dataset['id']});
                gdeltEvent.fetch({
                    success: function(d) {
                        var eventModal = new EventModal(d);
                        var eventModalHtml = eventModal.render();
                        var eventModalWrapper = $('#eventModal');
                        eventModalWrapper.html(eventModalHtml);
                        eventModalWrapper.modal();
                    }
                });
            });
            this.$el.on('click', '.country', function(e) {
                var o = events.map.zoom(e.target.id); events.zoom(o);
            });
            this.$el.on('dblclick', '.country', function(e) {
                var o = events.map.zoom(); events.zoom(o);
            });
        }

    });

    return SVGView;

});
