var Flow = require('react-flow')
  , listenFor = Flow.defineStore.listenFor
  , Url = require('url')
  , Promise = require('bluebird')
  , Collection = Flow.Collection
  , Model = Flow.Model
  , _ = require('lodash')
  , appConstants = require('../constants/appConstants');

module.exports = Flow.defineStore({

    mixins: [ Flow.DataHelperStoreMixin ],

    initialize: function(){
        this.collections = []
        this.models = []
    },
    getInitialData: function(){

        return {
            authorized:    false,
            access_token:  localStorage.getItem('porch_access_token'),
            refresh_token: localStorage.getItem('porch_refresh_token'),
            adaptor: null,
        }
    },

    actions: [

        listenFor(appConstants.START, function(options){
            this._extend(options)
        }),

        listenFor('dal_register', function(type){
            // if ( type instanceof Collection )
            //     !_.contains(this.collections, type)) && this.collections.push(type)

            if ( type instanceof Model )
                !_.contains(this.models, type) && this.models.push(type)

            else throw new TypeError('can only register Models')
        })

        listenFor('dal_model_update', function(model){
            //this._extend(options)
        })

        listenFor('dal_model_create', function(model){
            //this._extend(options)
        })

        listenFor('dal_model_delete', function(model){
            //this._extend(options)
        })

    ],

	_requestAuthCode: function( landingPoint, clientId ){
        var redirect = location.origin + landingPoint
          , query = '/oauth/authorize?response_type=token&client_id=' + clientId + '&redirect_uri=' + redirect
        
        window.location = this.get('server') + query
    },

    _requestAccessToken: function( redirect, code, clientId ){
        var self = this
          , url = this.server +'/oauth/token'
          , xhr = $.ajax(url, {
            method: 'POST',
            data: {
                grant_type: 'authorization_code',
                client_id: clientId,
                redirect_uri: location.origin + redirect,
                code: code
            }    
        })
        
        return xhr.then(function(rsp){
            self._setTokens(resp.access_token, resp.refresh_token)
        })
    },

    _setTokens: function(access, refresh){
    	access  && localStorage.setItem('porch_access_token', access)
        refresh && localStorage.setItem('porch_refresh_token', refresh)

        this._extend({
            authenticated: !!access,
            access_token: access,
            refresh_token: refresh
        });
    }
})


function add()