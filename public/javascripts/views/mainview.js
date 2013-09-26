define(['jquery',
        'underscore',
        'backbone',
        'd3',
        'gdeltquery',
        'drawing',
        'drawinghistory',
        'queryhistory',
        'mapview',
        'eventview',
        'actorview',
        'svgview'],
function($, _, Backbone, d3, GDELTQuery, Drawing,
         DrawingHistory, QueryHistory, MapView,
         EventView, ActorView, SVGView) {
    var MainView = Backbone.View.extend({
        el: '#interactive_control',

        events: {
            'click #reload': 'reload',
            'click #view_query': function() {
                alert(this.query.constructQueryString());
            },
            'click #clear_query': function() {
                this.query = new GDELTQuery();
                this.drawing.set('query', this.query);
                this.eventview.set_query(this.query);
                this.actor1view.set_query(this.query);
                this.actor2view.set_query(this.query);
                this.eventview.render();
                this.actor1view.render();
                this.actor2view.render();
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

            this.mapview = new MapView();
            this.eventview = new EventView(this.query);
            this.actor1view = new ActorView(this.query, 'actor1');
            this.actor2view = new ActorView(this.query, 'actor2');
            this.svgview = new SVGView();
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
            this.eventview.set_query(this.query);
            this.actor1view.set_query(this.query);
            this.actor2view.set_query(this.query);
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