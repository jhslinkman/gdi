define(['jquery',
        'underscore',
        'backbone',
        'd3',
        'tree'],
function($, _, Backbone, d3,
         Tree) {

    var QueryView = Backbone.View.extend({
        el: '#search',

        events: {
            'click #search': function() {
                if (!this.tree) {
                    this.tree = new Tree('/api/statistics', {
                        'height': 500,
                        'width': 850,
                        'svgId': '#svg'
                    });
                    this.tree.json();
                }
                this.drawing.hide();
            }
        }

        // initialize: function() {
            
        // }

    });

    return QueryView;

});
