define(['underscore', 'backbone'], function(_, Backbone) {

    var GDELTEvent = Backbone.Model.extend({
        urlRoot: '/api/events'
        // function() {
        //     if (this.isNew()) {
        //         throw new Error('Cannot create new events with this interface.');
        //     } else {
        //         return '/events/' + this.id;
        //     }
        // }
    });

    return GDELTEvent;

});