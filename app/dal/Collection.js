var _ = require('lodash')
  , Model = require('./Model')
  , extend = require('react-flow/lib/util/extend')
  , sync = require('../util/sync')
  , arrayProto = Array.prototype;

module.exports = Collection

Collection.extend = extend;

function urlError() {throw new Error('A "url" property or function must be specified') };

function Collection(data, model) {
    var self = this;

    self.model = model || self.model

    self.uuid = _.uniqueId('collection_')

    self.push.apply(this, data)
    /*_.each(data, function(datum){
        self[idx] = self._createModel(datum);
    })*/
}

_.extend(Collection.prototype, {
 
    model: Model,

    toJSON: function() {
        var json = new Array(this.length)
          , value;

        for (var idx = 0; idx < this.length; idx++){
            value = this[idx];

            if (value instanceof Model) 
                value = value.toJSON();
            
            json[idx] = value;
        }

        return json;
    },

    _createModel: function(item){
        var self = this
          , model = item instanceof this.model
            ? item
            : new this.model(item);

        model.parent = function(){ return self }

        return model;
    },
   
    get: function(item){
    	return (item.id != null && this.find(item, { id: item.id })) || this.find(item, { id: item }) || this[this.indexOf(item)]  
    },

	fetch: function (reset) {
        var self = this;

        return sync('read', self, {})
            .then(function (data) {
                if ( reset ) self.clear()

                self.push.apply(this, data)
            });
    },

    create: function (item) {
        var model = this._createModel(item);

        this.push(model);
        return model.save();
    },

    clone: function() {
        return new this.constructor(this.toJSON())
    },

    clear: function() {
        this.splice(0, this.length);
    },

    remove: function(item) {
        this.splice(this.indexOf(item), 1);
    },

    push: function(){
        return arrayProto.push.apply(this, _.map(arguments, this._createModel, this ))
    },

    splice: function(idx, howMany){
        var add = _.map(_.rest(arguments, 2), this._createModel, this )

        return arrayProto.splice.apply(this, [ idx, howMany ].concat(add) )
    },

    unshift: function(){
        return arrayProto.unshift.apply(this, _.map(arguments, this._createModel, this ))
    }
})



_.each([ 'pop', 'slice', 'shift', 'join'], function(method){
    Collection.prototype[method] = function(){
        arrayProto[method].apply(this, arguments)
    }
})

_.each([ 'map', 'filter', 'reduce', 'sortBy', 'groupBy', 'forEach', 'every'
       , 'indexOf', 'find', 'any', 'without', 'pull', 'findIndex', 'some' ], function(method){

    Collection.prototype[method] = function(){
        return _.apply( _, [this].concat(arguments) )
    }
})