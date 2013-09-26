define(['jquery',
        'underscore',
        'backbone',
        'gdeltevent',
        'text!../../templates/eventmodal_template.html',
        'text!../../templates/cameo_codes.json'],
function($, _, Backbone, GDELTEvent, eventmodal_template, cameo_codes) {
    EventModal = Backbone.View.extend({
        template: eventmodal_template,

        initialize: function(gdeltevent) {
            this.event = gdeltevent;
            this.cameo_codes = JSON.parse(cameo_codes);
        },

        render: function() {
            return _.template(this.template, {
                event: this.event.attributes,
                eventtype: this.cameo_codes[this.event.attributes.eventcode].description
            });
        }
    });
    return EventModal;
});