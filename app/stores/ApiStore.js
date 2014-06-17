var Store = require('react-flow').Store
  , appConstants = require('../constants/AppStateConstants');

var apiActions = {}

apiActions[appConstants.AUTHENICATE] = function(){
	var self = this
	  , appState = self.refs.AppState;

	return self.waitFor( appState )
		.then(function(){
			if ( !appState.get('authorized') ) return

			self.fetch()
		})
},

module.exports = Store.define({

	refs: {
		AppState: require('./AppStateStore')
	},

	actions: apiActions,

	getUrl: function(){

	}
})