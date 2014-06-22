"use strict"
var _ = require('lodash')
  , pathRegex = require('path-to-regexp');

module.exports = Route

function Route(pattern) {
    var self = this
      , keys = [];

    this.pattern = pattern
    this.regex = pathRegex(pattern, keys)
    this.optionals = 0
    this.repeats = 0

    this.keys = _.map(keys, function(key) {

        key.replaceRegex = replaceRegex(key)

        if( key.optional) self.optionals++
        if( key.repeats ) self.repeats++

        return key
    });

};

Route.prototype = {

    match: function(fragment){
        var match = this.regex.exec(fragment)
          , keys = this.keys
          , params = {}

        if(!match) return null

        return { 
            path: match[0],
            params: _.transform(match.slice(1), function(obj, val, idx){
                obj[keys[idx].name] = val
            }, {})
        }   
    },

    generate: function(params, query){
        var keys = this.keys
          , path = this.pattern
          , value, key, provided;

        _.each(keys, function(key, idx){
            provided = _.has(params, key.name)
            value = params[key.name]
            
            if( provided )
                path = path.replace(key.replaceRegex, value)
            else {
                if( !key.optional ) return null
                else path = path.replace(key.replaceRegex, '').replace('//', '/')
            }
        })

        return path.replace(/^[#\/]|\s+$/g, '')
    }
}

function replaceRegex( key) {
    var suffix = key.optional 
        ? key.repeat ? '\\*' : '\\?'
        : key.repeat ? '\\+' : ''

    return RegExp(':' + key.name + suffix, 'ig')
}
