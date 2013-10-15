requirejs.config({
    paths: {
        // in lib/
        'jquery': 'lib/jquery-2.0.3.min',
        'underscore': 'lib/underscore.min',
        'backbone': 'lib/backbone.min',
        'bootstrap': 'lib/bootstrap-3.0.0.min',
        'd3': 'lib/d3.v3.min',
        // in models/
        'tree': 'models/tree',
        'drawing': 'models/drawing',
        'gdeltevent': 'models/gdeltevent',
        'gdeltquery': 'models/gdeltquery',
        // in views/
        'treeView': 'views/treeView'
        // in collections/
        
    },

    shim: {
        'backbone': {
            deps: ['jquery', 'underscore'],
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
         'tree',
         'treeView',
         'bootstrap'],
    function($, Tree, TreeView) {
    $(document).ready( function() {
        tree = new Tree('/api/statistics', {
            'height': 500,
            'width': 850,
            'svgId': '#drawing'
        });
        tree.json();
        // treeView = new TreeView();
    });
});