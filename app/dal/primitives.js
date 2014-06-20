"use strict"
var _ = require('lodash');

module.exports = {
    isPrimative: function(ctor){
         return _.any([ String, Boolean, Number, Date ], ctor)
    },
    parsers: {
        "[object Number]": function (value) {
            return parseFloat(value);
        },

        "[object Date]": function (value) {
            return new Date(value)
        },

        "[object Boolean]": function (value) {
            if (typeof value === 'string') 
                return value.toLowerCase() === "true";
   
            return value != null ? !!value : value;
        },

        "[object String]": function (value) {
            return value != null ? (value + "") : value;
        }
    }
}

