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

        initialize: function() {
            this.$('#events').on('click', '.event', function(e) {
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
        }

    });

    return SVGView;

});
