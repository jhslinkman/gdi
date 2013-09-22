define(['jquery',
        'underscore',
        'backbone',
        'gdeltdata',
        'swig',
        'text!../../templates/eventview_template.html',
        'text!../../templates/baseeventselect.html',
        'text!../../templates/cameo_codes.json'],
function($, _, Backbone, GdeltData, swig,
    eventview_template, basecode_template, cameo_codes) {
    var EventView = Backbone.View.extend({
        el: '#event',
        template: eventview_template,
        // basecode_template: _.template(basecode_template);
        // eventcode_template: _.template(eventcode_template);
        initialize: function(gdeltdata) {
            var _this = this;
            this.data = gdeltdata;
            this.render();
            this.cameo_codes = JSON.parse(cameo_codes);
            // $.get('/api/cameocodes', function(data) {_this.cameo_codes = data;})
        },
        render: function() {
            this.$el.html(eventview_template);
            // this.$('#eventbasecode').html('<option value = "1">Here</option>');
            return this;
        },
        render_baseeventcode: function() {
            // called after changing rooteventcode on model
            $('#eventbasecode').html(_.template(basecode_template, {
                label: 'Event base type',
                eventcodes: this.cameo_codes[this.data.get('eventrootcode')]['baseeventcodes'],
                cameo_codes: this.cameo_codes,
            }));
        }
        render_eventcode: function() {
            // called after changing baseeventcode on model
            $('#eventcode').html(_.template(basecode_template, {
                label: 'Refined event type',
                eventcodes: this.cameo_codes[this.data.get('baserootcode')]['eventcodes'],
                cameo_codes: this.cameo_codes,
            }));
        }
    })
    return EventView;
});