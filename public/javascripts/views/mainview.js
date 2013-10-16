define(['jquery',
        'underscore',
        'backbone',
        'd3',
        'gdeltquery',
        'drawing',
        'tree',
        'drawinghistory',
        'queryhistory',
        'mapview',
        'eventview',
        'actorview',
        'svgview',
        'summaryModal'],
function($, _, Backbone, d3, GDELTQuery, Drawing, Tree,
         DrawingHistory, QueryHistory, MapView,
         EventView, ActorView, SVGView, SummaryModal) {
    var MainView = Backbone.View.extend({
        el: '#query_control',

        events: {
            // 'click #reload': 'reload',

            // 'click #clear_query': function() {
            //     this.query = new GDELTQuery();
            //     this.drawing.set('query', this.query);
            //     this.eventview.set_query(this.query);
            //     this.actor1view.set_query(this.query);
            //     this.actor2view.set_query(this.query);
            //     this.eventview.render();
            //     this.actor1view.render();
            //     this.actor2view.render();
            // },

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
                this.drawing.hide();
                this.$('.draw').hide();
                this.$('.query').show();
            },

            'click #back': function(e) {
                this.tree.hide();
                this.drawing.show();
                this.$('.draw').show();
                this.$('.query').hide();
            },            

            'click #draw': function(e) {
                // this.query = new GDELTQuery();
                this.getQueryAttribudes();
                d3.select('#events').selectAll('circle').remove();
                var drawing = this.drawing;
                drawing.set_events(function() {
                    if (drawing.get('centeredCountry') !== null) {
                        drawing.set('centeredCountry', null);
                    }
                    drawing.draw_events();
                });
                drawing.show();
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
            var query = new GDELTQuery();
            var drawing = new Drawing(query);
            this.listenTo(drawing, 'change:events_loaded', this.loading);
            var _this = this;
            drawing.draw(function() {_this.stopListening(drawing);});
            this.drawinghistory = new DrawingHistory();
            this.drawinghistory.add(drawing);
            this.queryhistory = new QueryHistory();
            this.queryhistory.add(query);

            // this.query = new GDELTQuery();
            this.query = _.clone(query);
            this.drawing = new Drawing(this.query);
            this.listenTo(this.drawing, 'change:events_loaded', this.loading);

            // this.mapview = new MapView();
            // this.eventview = new EventView(this.query);
            // this.actor1view = new ActorView(this.query, 'actor1');
            // this.actor2view = new ActorView(this.query, 'actor2');
            this.svgview = new SVGView(this.drawing);
        },

        reload: function() {
            // clear that svg data which needs clearing
            d3.selectAll('circle').remove();

            // redraw
            var drawing = this.drawing;
            var _this = this;
            drawing.set_events(function() {
                drawing.draw_events();
                _this.stopListening(drawing);
            });

            // clear old data and update history
            this.drawinghistory.add(drawing);
            this.queryhistory.add(this.query);

            // create new drawing and query objects
            this.query = _.clone(this.query);
            this.drawing = new Drawing(this.query);
            this.listenTo(this.drawing, 'change:events_loaded', this.loading);
            // this.eventview.set_query(this.query);
            // this.actor1view.set_query(this.query);
            // this.actor2view.set_query(this.query);
        },

        loading: function(d) {
            if (d.get('events_loaded')) {
                $('#loading').addClass('hidden');
            } else {
                $('#loading').removeClass('hidden');
            }
        }
    })
    return MainView;
});