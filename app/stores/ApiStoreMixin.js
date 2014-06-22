var _ = require('lodash')
  , on = require('react-flow').defineStore.listenFor
  , appConstants = require('../constants/AppStateConstants')
  , ajax  = require('../util/ajax');


module.exports = {

	refs: {
		AppState: require('./AppStateStore')
	},

    getInitialData: function(){
        return {
            authenticated: false
        }
    },

    actions: [

        on(appConstants.AUTHENICATE, function(){
            var self = this
              , appState = self.refs.AppState;

            return self.waitFor( appState )
                .then(function(){
                    if ( !appState.get('authenticated') ) return

                    return self._authenticated()
                })
        })
    ],


	queryString: function(prefix){
        return (prefix ? '?' : '&') + 'access_token=' + this.access_token + '&token_type=Bearer'
    },

	api: function(url, params, opts){
        opts = opts || {};

        if ( !this.refs.AppState.get('authenticated') ) 
        	return false;

        if ( opts.data ) params = _.extend({}, opts.data, params)

        opts = _.extend({}, opts, this.formatUrl(url, params), {
            crossDomain: true,
            dataType: 'json',
            headers: { 
                Authorization: 'Bearer ' + this.refs.AppState.get('access_token')
             }  
        });

        return ajax(opts)
    },
    
    formatUrl: function (url, params){
        var server = this.refs.AppState.get('server')
          , paramReg = /(:[^/]*?)(\/|$)/
          , pathParams = [ params ]
          , paramStr, param;

        while ( paramReg.test(url) ){
            paramStr = url.match(paramReg)[1];
            param    = paramStr.substring(1)
            url      = url.replace(paramStr, params[param] || '')

            pathParams.push(param)
        }

        url = url.replace('//', '').trim()
        url = url.charAt(url.length - 1) === '/' ? url.substring(0, url.length - 1) : url;

        return { 
            url:  server + url, 
            data: _.omit(params, pathParams) 
        }
    } 
}