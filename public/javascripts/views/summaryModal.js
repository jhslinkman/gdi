define(['jquery',
        'underscore',
        'backbone',
        'gdeltevent',
        'text!../../templates/summaryModalTemplate.html',
        'text!../../templates/cameo_codes.json'],
function($, _, Backbone, GDELTEvent, summaryModalTemplate, cameoCodes) {
    EventModal = Backbone.View.extend({
        template: summaryModalTemplate,

        initialize: function(query) {
            this.query = query;
            this.cameoCodes = JSON.parse(cameoCodes);
        },

        render: function() {
            return _.template(this.template, {
                queryAttrs: this.query.attributes
            });
        }
    });
    return EventModal;
});