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
                var val = e.target.selectedOptions[0].value;
                if (val !== 'none') {
                    this.query.set('eventrootcode', val);
                } else {
                    this.query.unset('eventrootcode');
                    this.query.unset('eventbasecode');
                    this.query.unset('eventcode');
                }
            },
            'change #eventbasecode': function(e) {
                var val = e.target.selectedOptions[0].value;
                if (val !== 'none') {
                    this.query.set('eventbasecode', val);
                } else {
                    this.query.unset('eventbasecode');
                    this.query.unset('eventcode');
                }
            },
            'change #eventcode': function(e) {
                this.query.set('eventcode', e.target.selectedOptions[0].value);
            }
        },
        initialize: function(gdeltquery) {
            this.set_query(gdeltquery);
            this.cameo_codes = JSON.parse(cameo_codes);
            this.render();
        },

        set_query: function(query) {
            this.query = query;
            this.listenTo(this.query, 'change:eventrootcode', this.render_baseeventcode);
            this.listenTo(this.query, 'change:eventbasecode', this.render_eventcode);
        },

        render: function() {
            var eventrootcode = this.query.get('eventrootcode');
            this.$el.html(_.template(eventview_template, {eventrootcode: eventrootcode}));
            this.render_baseeventcode()
            this.render_eventcode()
            return this;
        },
        render_baseeventcode: function() {
            // called after changing rooteventcode on model
            try {
                var eventbasecodes = this.cameo_codes[this.query.get('eventrootcode')]['baseeventcodes'];
            } catch (e) {
                if (e instanceof TypeError) {
                    var eventbasecodes = [];
                } else {
                    throw e;
                }
            }
            if (eventbasecodes.length > 0) {
                $('.eventbasecode').removeClass('hidden');
                $('.eventcode').addClass('hidden');
                $('#eventbasecode').html(_.template(select_template, {
                    label: 'Event base type',
                    eventcodes: eventbasecodes,
                    selectedEvent: this.query.get('eventbasecode'),
                    cameo_codes: this.cameo_codes,
                }));
            } else {
                $('.eventbasecode').addClass('hidden');
                $('.eventcode').addClass('hidden');
            }
        },

        render_eventcode: function() {
            // called after changing baseeventcode on model
            try {
                var eventcodes = this.cameo_codes[this.query.get('eventbasecode')]['eventcodes'];
            } catch (e) {
                if (e instanceof TypeError) {
                    var eventcodes = [];
                } else {
                    throw e;
                }
            }
            if (eventcodes.length > 0) {
                $('.eventcode').removeClass('hidden');
                $('#eventcode').html(_.template(select_template, {
                    label: 'Refined event type',
                    eventcodes: eventcodes,
                    selectedEvent: this.query.get('eventcode'),
                    cameo_codes: this.cameo_codes,
                }));
            } else {
                $('.eventcode').addClass('hidden');
            }
        }
    });
    return EventView;
});