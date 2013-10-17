define(['jquery',
        'underscore',
        'backbone',
        'd3',
        'fitProjection',
        'gdeltquery',
        'map',
        'events',
        'tree',
        'queryhistory',
        'mapview',
        'eventview',
        'actorview',
        'svgview',
        'summaryModal'],
function($, _, Backbone, d3, fitProjection, GDELTQuery, Map, Events, Tree,
         QueryHistory, MapView,
         EventView, ActorView, SVGView, SummaryModal) {
    var MainView = Backbone.View.extend({
        el: '#query_control',

        events: {
            // 'click': function(e) {alert('click');},

            'click #search': function(e) {
                if (!this.tree) {
                    this.tree = new Tree('/api/statistics', {
                        'height': 500,
                        'width': 850,
                        'id': 'eventCodeTree',
                        'svgId': '#svg'
                    });
                    this.tree.json();
                } else { this.tree.show(); }
                this.map.hide();
                this.gdeltEvents.hide();
                this.$('.draw').hide();
                this.$('.query').show();
            },

            'click #back': function(e) {
                this.tree.hide();
                this.map.show();
                this.gdeltEvents.show();;
                this.$('.draw').show();
                this.$('.query').hide();
            },            

            'click #draw': function(e) {
                // this.query = new GDELTQuery();
                this.getQueryAttribudes();
                d3.select('#events').selectAll('circle').remove();
                var gdeltEvents = this.gdeltEvents;
                gdeltEvents.get(function() {
                    if (gdeltEvents.map.focus !== null) {
                        drawing.focus = null;
                    }
                    gdeltEvents.draw();
                });
                this.map.show();
                this.gdeltEvents.show();;
                this.$('.draw').show();
                this.tree.hide();
                this.$('.query').hide();
            },

            'click #summary': function(e) {
                this.getQueryAttribudes();
                var summaryModal = new SummaryModal(this.query);
                var summaryModalHtml = summaryModal.render();
                var summaryModalWrapper = $('#summaryModal');
                summaryModalWrapper.html(summaryModalHtml);
                summaryModalWrapper.modal();
            }

        },

        getQueryAttribudes: function() {
            // parse event code from query tree
            var aecs = d3.select('#eventCodeTree').selectAll('.selected').data();
            this.query.clear();
            var ercs = [],
                ebcs = [],
                ecs = [];
            for (var i = 0; i < aecs.length; i++) {
                if (aecs[i].code === '0') {
                    var ercs = [],
                        ebcs = [],
                        ecs = [];
                    break
                } else if (aecs[i].code.length === 2) {
                    ercs.push(aecs[i].code);
                } else if (aecs[i].code.length === 3) {
                    ebcs.push(aecs[i].code);
                } else if (aecs[i].code.length === 4) {
                    ecs.push(aecs[i].code);
                }
                if (ercs.length > 0) this.query.set('eventrootcode', ercs);
                if (ebcs.length > 0) this.query.set('eventbasecode', ebcs);
                if (ecs.length > 0) this.query.set('eventcode', ecs);
            }
            
        },

        initialize: function() {

            this.on('map_loading', function(e) {
                $('#map_loading').removeClass('hidden')
            });

            this.on('map_loaded', function(e) {
                $('#map_loading').addClass('hidden')
            });

            this.on('events_loading', function(e) {
                $('#events_loading').removeClass('hidden')
            });

            this.on('events_loaded', function(e) {
                $('#events_loading').addClass('hidden')
            });

            this.setSize();

            this.query = new GDELTQuery();
            this.map = new Map();
            this.map.setSvgAttrs();
            var _this = this;
            this.map.get(function() {_this.fitMapProjection(); _this.map.draw(); _this.trigger('map_loaded');});
            this.gdeltEvents = new Events(this.map, this.query);
            this.gdeltEvents.get(function() {_this.gdeltEvents.draw(); _this.trigger('events_loaded')});
            this.svgview = new SVGView(this.gdeltEvents);
        },

        resize: function(_this) {
            _this = _this || this;
            _this.setSize();
            _this.map.setSvgAttrs();
            _this.fitProjection();
            _this.map.draw();
            _this.gdeltEvents.draw();
        },

        setSize: function() {
            var width = $('#svgContainer').width(),
                height = Math.min($(window).height(), width);
            d3.select('#svg').attr('width', width).attr('height', height);
        },

        fitProjection: function() {
            return fitProjection;
        },

        fitMapProjection: function() {
            var w = $('#svgContainer').width(),
                h = $('#svgContainer').height(),
                pos = $('#svgContainer').position(),
                box = [[pos.left, pos.top], [w, h]],
                p = this.map.projection();
            fitProjection(p, this.map.data, box)
            this.map.scale = p.scale();
            this.map.translate = p.translate();
        }

    })
    return MainView;
});