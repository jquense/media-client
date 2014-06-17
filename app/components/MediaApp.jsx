var React = require('react')
  , ArtistList   = require('./ArtistList.jsx')
  , MediaContent = require('./MediaContent.jsx')
  , appActions = require('../actions/appActions')
  , StoreWatch = require('react-flow').StoreWatchMixin
  , appConstants = require('../constants/appStateConstants');


module.exports = MediaApp = React.createClass({

	mixins: [ 
		StoreWatch(App.appStore, App.artistListStore)
	],

	componentWillMount: function() { 
		appActions.app_authenticate()
	},

	render: function() {
		return ( 
		  	<div className="container">
			    <ArtistList
			      artists={ this.state.artists }
			    />
	    		<MediaContent/>
		  	</div>
		);
	},

	getStoreState: function(){
		return App.artistListStore.get()
	},

	_onChange: function(){
		this.setState(App.artistListStore.getArtists())
	}

});
