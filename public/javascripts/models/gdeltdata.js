define(['underscore', 'backbone'], function(_, Backbone) {

    var GdeltData = Backbone.Model.extend({
        defaults: {
            eventrootcode: '10',
            eventbasecode: '000',
            eventcode: '0000',
            isrootevent: null,
            actor1: null,
            actor2: null
        },

    });

    return GdeltData;

});