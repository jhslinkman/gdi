var queryDict = {
    globaleventid: function(val) {return true;},

    eventrootcode: function(val) {return val.length === 2;},
    eventbasecode: function(val) {return val.length === 3;},
    eventcode: function(val) {return val.length === 3 || val.length === 4;},

    actor1countrycode: function(val) {return val.length === 3;},
    actor1knowngroupcode: function(val) {return val.length === 3;},
    actor1ethnicitycode: function(val) {return val.length === 3;},
    actor1religioncode: function(val) {return val.length === 3;},
    actor1type1code: function(val) {return val.length === 3;},
    actor1type2code: function(val) {return val.length === 3;},
    actor1type3code: function(val) {return val.length === 3;},

    actor2countrycode: function(val) {return val.length === 3;},
    actor2knowngroupcode: function(val) {return val.length === 3;},
    actor2ethnicitycode: function(val) {return val.length === 3;},
    actor2religioncode: function(val) {return val.length === 3;},
    actor2type1code: function(val) {return val.length === 3;},
    actor2type2code: function(val) {return val.length === 3;},
    actor2type3code: function(val) {return val.length === 3;}
}

module.exports = function(key, val) {
    val = val.replace(/(\\|;)/g, '');
    return queryDict[key](val);
} 