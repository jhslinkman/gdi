requirejs.config({
    paths: {
        // in lib/
        'jquery': 'lib/jquery-2.0.3.min',
        'underscore': 'lib/underscore.min',
        'backbone': 'lib/backbone.min',
        'bootstrap': 'lib/bootstrap-3.0.0.min',
        'd3': 'lib/d3.v3.min',
        // in models/
        'drawing': 'models/drawing',
        'gdeltevent': 'models/gdeltevent',
        'gdeltquery': 'models/gdeltquery',
        // in views/
        'actorview': 'views/actorview',
        'eventview': 'views/eventview',
        'mainview': 'views/mainview',
        'mapview': 'views/mapview',
        'reloadview': 'views/reloadview',
        'svgview': 'views/svgview',
        'eventmodal': 'views/eventmodal',
        // in collections/
        'drawinghistory': 'collections/drawinghistory',
        'queryhistory': 'collections/queryhistory'
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
        }
    }
});

require(['jquery',
         'mainview',
         'gdeltevent',
         'bootstrap'],
    function($, MainView, GDELTEvent) {
    $(document).ready( function() {
        mainview = new MainView();
    });
});