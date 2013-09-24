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
        'mainview': 'views/mainview',
        'mapview': 'views/mapview',
        'eventview': 'views/eventview',
        'actorview': 'views/actorview',
        'reloadview': 'views/reloadview',
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
        },
    }
});

require(['jquery',
         'mainview',
         'bootstrap'],
    function($, MainView) {
    $(document).ready( function() {
        mainview = new MainView();
    });
});