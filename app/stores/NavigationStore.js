var Flow = require('react-flow')
  , listenFor = Flow.defineStore.listenFor
  , Url = require('url')
  , Route = require('../lib/Route')
  , Promise = require('bluebird'), _ = require('lodash'), $ = require('jquery'), qs = require('qs')
  , navConstants = require('../constants/navigationConstants')
  , appConstants = require('../constants/appConstants');

var history = window.history
  , supported = !!(history && history.pushState)
  , trailingSlash = /\/$/
  , pathStripper = /#.*$/
  , routeStripper = /^[#\/]|\s+$/g
  , rootStripper = /^\/+|\/+$/g;

module.exports = Flow.defineStore({

    mixins: [ Flow.DataHelperStoreMixin ],

    initialize: function(){

        _.bindAll(this, ['_locationChange'])
    },

    getInitialData: function(options){

        return {
            started: false,
            pushState: options.pushState || true,
            fallbackToHash: !supported && options.hash !== false,
            useHistory:     options.pushState !== false && supported,
            root: ('/' + (options.root || '') + '/').replace(rootStripper, '/'),
            routes: {}
        }
    },
    
    actions: [

        listenFor( navConstants.START, appConstants.START, 
            function(options){
                options || (options = {})

                var fallbackToHash = options.hash !== false
                  , useHistory = options.pushState !== false && supported
                  , evnt = useHistory
                        ? 'popstate' : 'hashchange'
                
                $(window).on(evnt, this._locationChange)
                
                this._extend({
                        started : true,
                        pushState: options.pushState,
                        fallbackToHash: !supported && fallbackToHash,
                        useHistory: useHistory,
                        root: options.root,
                    }, function(a, b){
                        return b === undefined ? a : b;
                    })

                this._setLocation(window.location) 
            }),

        listenFor( navConstants.STOP, appConstants.STOP, 
            function(){
                $(window)
                    .off('popstate',   this._locationChange)
                    .off('hashchange', this._locationChange)

                this._set('started', false)
            }),

        listenFor( navConstants.NAVIGATE, 
            function(fragment, options){
                var url = this.data.root + (fragment = fragment.replace(routeStripper, ''))
                  , replace = options.replace;

                options || ( options = {} )

                if ( !this.data.started) return false;
                if ( this.getFragment() === fragment) return;
        
                if (fragment === '' && url !== '/') 
                    url = url.slice(0, -1);

                if( this.data.useHistory ) 
                    history[replace ? 'replaceState' : 'pushState']({}, document.title, url)

                else if ( this.data.fallbackToHash )
                    this._updateHash(fragment, replace);
                else
                    return window.location.assign(url)

                this._setLocation(window.location)
            }),

        listenFor( navConstants.REGISTER, function(routes){
            var self = this
              , params = {}

            routes = _.map([].concat(routes), function(route){
                return new Route(route)
            })

            if ( this.data.started)
                this._setLocation(this.data, routes)
            else
                this._merge('routes', routes)
        })
    ],


	getFragment: function(loc) {
        var fragment

        loc = loc || this.data;

        if (  this.data.useHistory ) {
            var root = this.data.root.replace(trailingSlash, '');

            fragment = decodeURI(loc.pathname + loc.search);

            if (fragment.indexOf(root) !== -1) 
                fragment = fragment.slice(root.length);
        } else 
            fragment = _.rest(loc.hash).join('');
        
        return fragment.replace(routeStripper, '');
    },

    _match: function(fragment, routes){
        var match = {}
          , found;
      
        fragment = fragment.split('?')[0]

        routes = routes || this.get('routes')

        found = _.any(routes, function(route, name){
            var route = route.match(fragment)

            _.any(routes, function(r){ 
                
                return route
            })

            if( route ) 
                match = { 
                    currentRoute: name, 
                    params: route.params
                }

            return !!route
        })

        return found ? match : null;
    },

    _locationChange: function(e){
        this._setLocation(window.location)
    },

    _setLocation: function(loc, routes){
        var parsed   = Url.parse(loc.href, true)
          , fragment = this.getFragment(parsed)
          , match    = this._match(fragment, routes)

        this._extend(parsed, match, routes)
    },

    _updateHash: function( fragment, replace) {
        if( replace)
            window.location.replace(
                window.location.href.replace(/(javascript:|#).*$/, ''), '#' + fragment)
        else
            window.location.hash = '#' + fragment
    },

    getUrl: function(routeValues) {
        var url  = this.data.root
          , params = _.without(routeValues, 'action', 'method')
          , filter = _.defaults(
                _.pick(routeValues, 'action', 'method'), 
                _.pick(this.data, 'action', 'method'))
          , routes = this.get('routes')
          , match;

        routes = _.where(routes, filter);

        if (!routes) 
            throw new TypeError('No route by the found')
 
        _.any(routes, function(r) { 
            match = r.generate(params) 
            return match
        })

        if ( !match ) 
            throw TypeError('no valid route found') 

        url += match

        if ( query ) url += "?" + qs.stringify(query);
        
        return url;
   }
 
})
