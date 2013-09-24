define(['jquery',
        'underscore',
        'backbone',
        'gdeltquery',
        'text!../../templates/eventview_template.html',
        'text!../../templates/eventselect.html',
        'text!../../templates/cameo_codes.json'],
function($, _, Backbone, GDELTQuery,
    eventview_template, select_template, cameo_codes) {
    var EventView = Backbone.View.extend({
        el: '#event',
        template: eventview_template,
        events: {
            'change #eventrootcode': function(e) {
                this.query.set('eventrootcode', e.target.selectedOptions[0].value);
            },
            'change #eventbasecode': function(e) {
                this.query.set('eventbasecode', e.target.selectedOptions[0].value);
            },
            'change #eventcode': function(e) {
                this.query.set('eventcode', e.target.selectedOptions[0].value);
            }
        },
        initialize: function(gdeltquery) {
            var _this = this;
            this.query = gdeltquery;
            this.render();
            this.cameo_codes = JSON.parse(cameo_codes);
            this.listenTo(this.query, 'change:eventrootcode', this.render_baseeventcode);
            this.listenTo(this.query, 'change:eventbasecode', this.render_eventcode);
        },
        render: function() {
            this.$el.html(eventview_template);
            return this;
        },
        render_baseeventcode: function() {
            // called after changing rooteventcode on model
            $('.eventbasecode').removeClass('hidden');
            $('.eventcode').addClass('hidden');
            $('#eventbasecode').html(_.template(select_template, {
                label: 'Event base type',
                eventcodes: this.cameo_codes[this.query.get('eventrootcode')]['baseeventcodes'],
                cameo_codes: this.cameo_codes,
            }));
        },

        render_eventcode: function() {
            // called after changing baseeventcode on model
            var eventcodes = this.cameo_codes[this.query.get('eventbasecode')]['eventcodes'];
            if (eventcodes.length > 0) {
                $('.eventcode').removeClass('hidden');
                $('#eventcode').html(_.template(select_template, {
                    label: 'Refined event type',
                    eventcodes: eventcodes,
                    cameo_codes: this.cameo_codes,
                }));
            }
        }
    });
    return EventView;
});