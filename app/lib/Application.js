var React = require('react')
  , Dispatcher    =	require('react-flow/lib/Dispatcher')
  , routerActions = require('../actions/navActions')
  , RouterStore   = require('../stores/NavigationStore')
  , AppStore      = require('../stores/AppStore')
  , appActions    = require('../actions/appActions')
  , appConstants  = require('../constants/appConstants')

   //, Router = require('./Router')

var Application;

module.exports = {
	create: function(options){
		var app = new Application

		app.appStore = new AppStore()
		app.routerStore = new RouterStore({ pushState: true })

		app.appActions = appActions
		app.routerActions = routerActions
		app.routerActions._app = app
		//app.component = app._component()

		Dispatcher.register('Application',
			function(payload){
				var action = payload.action

				if( action === appConstants.START )
					app.mount(app.routerStore.get(), app.children)
			})

		return app
	}
}


function Application(){}


Application.prototype = {

	mount: function(props, children){

		React.renderComponent(this.component(props), document.body);
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
				return React.DOM.div(null, this.props.children)
			},

			_onRouteChange: function(){

			}

		})
	 }
}