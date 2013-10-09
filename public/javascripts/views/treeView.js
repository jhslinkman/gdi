define(['jquery',
        'underscore',
        'backbone',
        'd3',
        'gdeltquery',
        'tree'],
function($, _, Backbone, d3, GDELTQuery, Tree) {

    TreeView = Backbone.View.extend({
        el: '#svgTree',

        events: {
            // 'click .node .selected': function(e) {
            //     var g = e.target.parentElement;
            //     var code = g.id.slice(1);
            //     var q = this.query;
            //     q.set('eventcodes', _.without(q.get('eventcodes'), code));
            //     console.log(ecs);
            // },

            'click .node': function(e) {
                console.log('here');
                var g = e.target.parentElement;
                var code = g.id.slice(1);
                var q = this.query;
                var ecs = q.get('eventcodes') || [];
                if (_.indexOf(ecs, code) > -1) {
                    q.set('eventcodes', _.without(q.get('eventcodes'), code));
                } else {
                    ecs.push(code);
                    q.set('eventcodes', ecs);
                }
                console.log(q.get('eventcodes'))
            }
            // 'click .node': function(e) {
            //     var g = e.target.parentElement; 
            //     var code = g.id.slice(1);
            //     var q = this.query;
            //     if (code.length == 2) {
            //         codeLevel = 'eventrootcode';
            //     } else if (code.length == 3) {
            //         codeLevel = 'eventbasecode';
            //     } else if (code.length == 4) {
            //         codeLevel = 'eventcode';
            //     }
            //     cs = q.get(codeLevel);
            //     if (cs) {
            //         if (_.indexOf(cs, code) > -1) {
            //             q.set(codeLevel, _.without(cs, code));
            //         } else {
            //             cs.push(code)
            //             q.set(codeLevel, cs);
            //         }
            //     } else {
            //         q.set(codeLevel, [code]);
            //     }
            // }
        },

        initialize: function(gdeltevent) {
            this.query = new GDELTQuery();
            this.tree = new Tree('/api/statistics', {'height': 500, 'width': 850});
            this.tree.json();
        }

    });
    return TreeView;
});