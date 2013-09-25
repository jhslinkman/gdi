define(['jquery',
        'underscore',
        'backbone',
        'gdeltquery',
        'text!../../templates/actor_template.html',
        'text!../../templates/actor_codes.json'],
function($, _, Backbone, GDELTQuery,
    actor_template, actor_codes) {
    var ActorView = Backbone.View.extend({
        template: actor_template,

        events: function() {
            var e = {};
            e['change #' + this.actor + 'countrycode'] = function(e) {
                    this.setDataAttribute('countrycode', e.target.selectedOptions[0].value);
            }
            e['change #' + this.actor + 'knowngroupcode'] = function(e) {
                    this.setDataAttribute('knowngroupcode', e.target.selectedOptions[0].value);
            }
            e['change #' + this.actor + 'ethnicitycode'] = function(e) {
                    this.setDataAttribute('ethnicitycode', e.target.selectedOptions[0].value);
            }
            e['change #' + this.actor + 'religioncode'] = function(e) {
                    this.setDataAttribute('religioncode', e.target.selectedOptions[0].value);
            }
            e['change #' + this.actor + 'type1code'] = function(e) {
                    this.setDataAttribute('type1code', e.target.selectedOptions[0].value);
            }
            e['change #' + this.actor + 'type2code'] = function(e) {
                    this.setDataAttribute('type2code', e.target.selectedOptions[0].value);
            }
            e['change #' + this.actor + 'type3code'] = function(e) {
                    this.setDataAttribute('type3code', e.target.selectedOptions[0].value);
            }
            return e
        },

        setDataAttribute: function(code, val) {
            if (val !== 'none') {
                this.query.set(this.actor + code, val);
            } else {
                this.query.unset(this.actor + code);
            }
        },

        initialize: function(gdeltquery, actor) {
            this.set_query(gdeltquery);
            this.actor = actor;
            this.actor_codes = actor_codes;
            this.setElement('#' + actor);
            this.actor_codes = JSON.parse(actor_codes);
            this.render();
        },
        set_query: function(query) {this.query  = query;},

        render: function() {
            var type_options = _.template('<% for (var i = 0; i < type.length; i++) { var tuple = type[i]%><option value="<%= tuple[0] %>"><%= tuple[1] %></option><% } %>', {type: this.actor_codes['type']})
            var context = {
                actor: this.actor,
                actor_codes: this.actor_codes,
                type_options: type_options
            };
            // console.log(_.template(this.template, context));
            this.$el.html(_.template(this.template, context));
            return this;
        }

    });
    return ActorView;
});