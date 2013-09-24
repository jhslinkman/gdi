requirejs.config({
    paths: {
        // in lib/
        'jquery': 'lib/jquery-2.0.3.min',
        'underscore': 'lib/underscore.min',
        'backbone': 'lib/backbone.min',
        'bootstrap': 'lib/bootstrap-3.0.0.min',
        'd3': 'lib/d3.v3.min',
        'swig': 'lib/swig.min',
        // in models/
        'drawing': 'models/drawing',
        'gdeltquery': 'models/gdeltquery',
        // in views/
        'mapview': 'views/mapview',
        'eventview': 'views/eventview',
        'actorview': 'views/actorview',
        'reloadview': 'views/reloadview'
    },

    shim: {
        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['jquery', 'underscore'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'd3': {
            exports: 'd3'
        },
    }
});

require(['jquery',
         'gdeltquery',
         'drawing',
         'mapview',
         'eventview',
         'actorview',
         'reloadview',
         'bootstrap'],
    function($, GDELTQuery, Drawing, MapView, EventView, ActorView, ReloadView) {
    $(document).ready( function() {
        query = new GDELTQuery();
        drawing = new Drawing(query);
        reloadview = new ReloadView(drawing);
        mapview = new MapView(drawing);
        eventview = new EventView(query);
        actor1view = new ActorView(query, 'actor1');
        actor2view = new ActorView(query, 'actor2');
    });
});