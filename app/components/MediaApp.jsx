var React = require('react')
  , ArtistList   = require('./mediaLibrary/ArtistList.jsx')
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
			      indexes={ this.state.indexes }
			    />
	    		<MediaContent/>
		  	</div>
		);
	},

	getStoreState: function(){
		return {
			indexes: App.artistListStore.getIndexes() || null
		}
	},

	_onChange: function(){
		this.setState(App.artistListStore.getArtists())
	}

});
