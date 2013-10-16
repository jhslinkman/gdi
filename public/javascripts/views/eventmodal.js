define(['jquery',
        'underscore',
        'backbone',
        'gdeltevent',
        'text!../../templates/eventmodal_template.html',
        'text!../../templates/cameo_codes.json'],
function($, _, Backbone, GDELTEvent, eventModalTemplate, cameoCodes) {
    EventModal = Backbone.View.extend({
        template: eventModalTemplate,

        initialize: function(gdeltevent) {
            this.event = gdeltevent;
            this.cameoCodes = JSON.parse(cameoCodes);
        },

        render: function() {
            return _.template(this.template, {
                event: this.event.attributes,
                eventtype: this.cameoCodes[this.event.attributes.eventcode].description
            });
        }
    });
    return EventModal;
});