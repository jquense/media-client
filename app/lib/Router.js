"use strict"
var _ = require('lodash')
  , navActions = require('../actions/navActions')
  , Route = require('./Route')
  , NavStore   = require('../stores/NavigationStore');

module.exports = Router

function Router(options, app) {
    this.store = new NavStore(options)

    this.store.listen(function(){

    })
};

Router.prototype = {

    map: function(cb){
        var builder = new RouteBuilder()

        cb.call(builder)

        this.routes = builder.routes
        this._flattened = _.reduce(this.routes, function(arr, group){
            return arr.concat(
                _.reduce(group, function(arr, routes){
                    return arr.concat(routes)
                },[])
            )
        }, [])

        navActions.route_register()

        return this
    },

    start: function() {
        if( this.store.get('started') === false)
            navActions.route_start()

        return this
    },

    stop: function(){
        if( this.store.get('started') === true)
            navActions.route_stop()

        return this
    }
}



function RouteBuilder(name, path, canNest){
    this.routes = {}
    this.controllers = {}

    this.parent = name;
    this.root = path
    this._nest = canNest === false ? false : true
}

RouteBuilder.prototype = {

    method: function(action, path){
        route(this, action, path);
    },

    actions: function(name, path, cb){
        var builder;

        if ( !this._nest) throw new TypeError

        if( arguments.length === 2 && _.isFunction(path)){
            cb = path
            path = null 
        }

        if (!path ) 
            path = name

        if (this.root && this.root !== 'application' && path.charAt(0) !== '/' ) 
            path = this.root + '/' + path
        else 
            path = '/' + path

        if( cb ){
            builder = new RouteBuilder(name, path, false)
            cb.call(builder)
            _.merge(this.routes, builder.routes, function(a,b){
                return _.isArray(a) ? a.concat(b) : undefined
            })
        } 
        else {
            this.add(name, path)
        }
    },

    add: function(name, path){
        var parent = this.parent || name;

        path = _.map([].concat(path), function(path){
            return new Route(path)
        })

        this.routes[parent] = (this.routes[parent] || {})
        this.routes[parent][name] = ( this.routes[parent][name] || []).concat(path)
    }
}


function route(builder, name, path) {
    if (typeof path === 'function') throw new TypeError;

    if (path == null)
        path = name;
  
    path = _.map([].concat(path), function(path){
        if (builder.root && path.charAt(0) !== '/' ) 
            path = builder.root + '/' + path

        return path
    })

    builder.add(name, path)
}