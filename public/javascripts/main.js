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
        'gdeltmap': 'models/gdeltmap',
        'gdeltdata': 'models/gdeltdata',
        // in views/
        'mapview': 'views/mapview',
        'eventview': 'views/eventview'
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
        'swig': {
            exports: 'swig'
        }

        // 'gdeltmap': {
        //     deps: ['underscore', 'backbone', 'd3'],
        //     exports: 'GdeltMap'
        // },

        // 'mapview': {
        //     deps: ['jquery', 'underscore', 'backbone', 'gdeltmap', 'text!../templates/mapview_template.html'],
        //     exports: 'MapView'
        // }
    }
});

require(['jquery',
         'gdeltdata',
         'gdeltmap',
         'mapview',
         'eventview',
         'swig',
         'bootstrap'],
    function($, GdeltData, GdeltMap, MapView, EventView, swig) {
    $(document).ready( function() {
        data = new GdeltData();
        drawing = new GdeltMap();
        mapview = new MapView();
        eventview = new EventView(data);
        window.swig = swig;
    });
});