var React = require('react')
  , Dispatcher    =	require('react-flow/lib/Dispatcher')
  , routerActions = require('../actions/navActions')
  , routerStore   = require('../stores/NavigationStore')
  , appStore      = require('../stores/AppStore')
  , appActions    = require('../actions/appActions')
  , appConstants  = require('../constants/appConstants')

   //, Router = require('./Router')

var Application;

module.exports = {
	create: function(options){
		var app = new Application

		app.appStore = new appStore()
		app.routerStore = new NavStore({ pushState: true })

		app.appActions = routerActions
		app.routerActions = routerActions
		
		app.component = app._component()

		Dispatcher.register('Application',
			function(payload){
				var action = payload.action

				if( action === appConstants.START )
					app.mount({}, this.children)
			})

		return app
	}
}


function Application(){}


Application.prototype = {

	mount: function(props, children){

		React.renderComponent(
			this.component(props || {}, children)
			, document.body);
	},

	get: function(key, type){
		key = key + type.charAt(0).toUpperCase() + type.substr(1)

		return this[key]
	},

	_component: function(){
		var app = this;

	 	return React.createClass({
	 		displayName: 'Application', 

			childContextTypes: {
		        app: React.PropTypes.instanceOf(Application)
		    },

		    getChildContext: function() {
	      		return { app: app };
		    },

			componentWillMount: function() { 
				app.routerStore.listen(this._onRouteChange); 
			}, 

			componentWillUnmount: function() { 
				app.routerStore.stopListening(this._onRouteChange); 
			},

			render: function(){
				return React.DOM.div({}, app.children)
			},

			_onRouteChange: function(){

			}

		})
	 }
}