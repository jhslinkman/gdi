define(['jquery',
        'underscore',
        'backbone',
        'gdeltquery'],
function($, _, Backbone, GDELTQuery) {

    var isSelected = function(e) {
        return (' ' + e.className + ' ').indexOf('selected') > -1;
    }

    TreeView = Backbone.View.extend({
        el: '#svgTree',

        events: {
            'click .node': function(e) {
                var g = e.target.parentElement; 
                var code = g.id;
                var q = this.query;
                if (code.length == 2) {
                    codeLevel = 'eventrootcode';
                } else if (code.length == 3) {
                    codeLevel = 'eventbasecode';
                } else if (code.length == 4) {
                    codeLevel = 'eventcode';
                }
                cs = q.get(codeLevel);
                if (cs) {
                    if (_.indexOf(cs, code) > -1) {
                        q.set(codeLevel, _.without(cs, code));
                    } else {
                        cs.push(code)
                        q.set(codeLevel, cs);
                    }
                } else {
                    q.set(codeLevel, [code]);
                }
            }
        },

        initialize: function(gdeltevent) {
            this.query = new GDELTQuery();
        }

    });
    return TreeView;
});