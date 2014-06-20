var _ = require('lodash')
  , Promise = require('bluebird')
  , expr = require('react-flow/lib/util/expression')
  , extend = require('react-flow/lib/util/extend')
  , sync = require('../util/sync')
  , primitives = require('./primitives')
  , toString = Object.prototype.toString
  , idDescriptor = {
        get : function(){ return this[this.idField]; },
        set : function(value){   this[this.idField] = value },
        enumerable : true
   };

module.exports = Model

function urlError() {throw new Error('A "url" property or function must be specified') };

function Model(data) {
    var self = this
      , fields = self._fields || {}
      , proxy = _.transform(this._fields || {}, function(d, field, key){
            d[key] = ('defaultValue' in field) 
                ? field.defaultValue
                : null;
      });
 
    this.uuid = _.uniqueId('model_');

    Object.defineProperties(self, _.mapValues(fields, _.partial(getDescriptor, proxy) ));

    _.extend(this, data);

    if (self.idField && self.idField !== 'id') 
        Object.defineProperty(self, "id", idDescriptor);
}

_.extend(Model.prototype , {

    idField: 'id',
   
    isNew: function() {
        return !this.id;
    },

    parent: _.noop,

    _parse: function(value, field) {
        var self = this
          , parse;

        field = (self._fields || {})[field];

        if (field) {
            parse = field.parse;

            if ( field.type && value instanceof field.type ) 
                return value;
        }
        
        return parse ? parse(value) : value;
    },

    get: function(path){
    	expr.getter(path)(this)   
    },

    toJSON: function(){
        var self = this
          , fields = self._fields || {};

        return _.transform(this, function(json, val, key){
            var field = fields[key]

            if( field && field.serialize !== false )
                json[key] = val
        })
    },

    url: function() {
        var base =
            _.result(this, 'urlRoot')      ||
            _.result(this.parent(), 'url') ||
            urlError();


        if (this.isNew()) return base;
        return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id);
    },

	fetch: function (options) {
        var self = this;

        return sync('read', self, options)
            .then(function (data) {
                _.extend(self, _.mapValues(data, self._parse, self)) 
            });
    },

    save: function (options) {
        var self = this;

        return sync(self.isNew() ? 'create' : 'update', self, options)
            .then(function (data) {
                _.extend(self, _.mapValues(data, self._parse, self)) 
            });
    },

    destroy: function (options) {
        return sync('delete', this, options);
    },

    clone: function() {
        return new this.constructor(this.toJSON())
    } 
})


Model.define = function(base, options) {
    var proto = {}
      , fields = {}
      , hasFields = false
      , model, field;

    if (arguments.length === 1) {
        options = base;
        base = Model;
    }

    for (name in options) {
        field = options[name]

        if ( field instanceof Field) {
            hasFields = true
            fields[name] = field
        } else
            proto[name] = field
    } 

    if ( hasFields) 
        proto._fields = fields

    model = extend(base, proto);   
    model.define = function(options) {
        return Model.define(model, options);
    };

    return model
}

function Field(def) {
    _.extend(this, def)
}

Model.field = function(type, options){
    var isArrayOfTypes = _.isArray(type) && type.length
      , def = {}
      , constructor;

    options || (options = {})

    constructor = isArrayOfTypes && type[0] || type
    constructor = typeof constructor === 'function' 
            ? constructor 
            : constructor.constructor

    if (!options.nullable) {
        def.defaultValue = options.defaultValue !== undefined 
            ? options.defaultValue 
            : isArrayOfTypes 
                ? [] 
                : constructor === Object
                    ? {}
                    : valueOf(new constructor)
    }

    def.ctor  = constructor
    def.parse = getParser(options, constructor, isArrayOfTypes)

    return new Field(def)
}

function getParser(options, constructor, isArrayOfTypes){
    var strType = toString(constructor)
      , parser  = options.parse || primitives.parsers[strType]
      , parse   = function (d){ 
          if (d instanceof constructor) return d
          var obj = d == null ? new constructor : new constructor(d)
          return valueOf(obj)
      };

  	if (parser) return parser

    if ( !isArrayOfTypes ) return parse

    return parseArray
    
    function parseArray(d){
        return _.map(d, parse) 
    }
}

function valueOf(inst){
    if( inst.valueOf ) inst = inst.valueOf();
    return inst
}

function getDescriptor(proxy, field, key ) {
    return {
        enumerable:   _.isBoolean(field.enumerable) ? field.enumerable : true,
        configurable: _.isBoolean(field.configurable) ? field.configurable : true,
        get: function(){ 
            return proxy[key] 
        },
        set: function(val){
            
            if ( val instanceof field.ctor )
                proxy[key] = val
            else if( field.parse)
                proxy[key] = field.parse(val)
            else
                throw TypeError('field: ' + key + 'incorrect type and no parser')
        },
    }
}