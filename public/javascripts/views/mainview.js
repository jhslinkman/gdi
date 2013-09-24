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
        'actorview'],
function($, _, Backbone, d3, GDELTQuery, Drawing,
         DrawingHistory, QueryHistory, MapView,
         EventView, ActorView) {
    var MainView = Backbone.View.extend({
        el: '#interactive_control',

        events: {
            'click #reload': 'reload',
            'click #view_query': function() {
                alert(this.query.constructQueryString());
            }
        },

        initialize: function() {
            var query = new GDELTQuery();
            var drawing = new Drawing(query);
            drawing.draw();
            this.drawinghistory = new DrawingHistory();
            this.drawinghistory.add(drawing);
            this.queryhistory = new QueryHistory();
            this.queryhistory.add(query);

            this.query = new GDELTQuery();
            this.drawing = new Drawing(this.query);

            this.mapview = new MapView();
            this.eventview = new EventView(this.query);
            this.actor1view = new ActorView(this.query, 'actor1');
            this.actor2view = new ActorView(this.query, 'actor2');
        },

        reload: function() {
            // d3.selectAll('path').remove();
            d3.selectAll('circle').remove();
            this.drawing.draw_events();
            this.drawinghistory.add(this.drawing);
            this.queryhistory.add(this.query);

            this.query = new GDELTQuery();
            this.drawing = new Drawing(this.query);
            this.eventview.set_query(this.query);
            this.actor1view.set_query(this.query);
            this.actor2view.set_query(this.query);
        }
    })
    return MainView;
});