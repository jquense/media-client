var navConstants = require('../constants/navigationConstants')
  , actions = require('react-flow').actions
  , _ = require('lodash');


module.exports = {
	
	start:    actions.dispatchTo(navConstants.START),

	stop:     actions.dispatchTo(navConstants.STOP),

	navigate: actions.dispatchTo(navConstants.NAVIGATE),

	map: actions
		.dispatchTo(navConstants.REGISTER, function(cb, send){
			var builder = new RouteBuilder()
			  , routes = []

	        cb.call(builder)

	        routes = _.reduce(builder.routes, function(arr, group, actions){
	            return arr.concat(
	                _.reduce(group, function(arr, routes, method){
	                    return arr.concat(_.map(routes, function(pattern){
	                    	return {
	                    		pattern: pattern,
	                    		method: method,
	                    		action: actions
	                    	}
	                    }))
	                },[])
	            )
	        }, [])

	        send([routes])
	})
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

        // path = _.map([].concat(path), function(path){
        //     return new Route(path)
        // })

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