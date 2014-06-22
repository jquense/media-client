var React = require('react')
  , ArtistList   = require('./mediaLibrary/ArtistList.jsx')
  , Link = require('./Link.jsx')
  , MediaContent = require('./MediaContent.jsx')
  , appActions = require('../actions/appActions')
  , StoreWatch = require('react-flow').StoreWatchMixin
  , appConstants = require('../constants/appStateConstants');


module.exports = MediaApp = React.createClass({

	mixins: [ 
		StoreWatch(App.appStore, App.artistListStore, App.navStore)
	],

	componentWillMount: function() {  
		appActions.app_authenticate()
	},

	render: function() {
		return ( 
		  	<div className="container">
		  		<Link href="/Home/5">Hi!</Link>
			    <ArtistList
			      indexes={ this.state.indexes }
			    />
	    		<MediaContent/>
		  	</div>
		);
	},

	getStoreState: function(){
		return {
			indexes: App.artistListStore.getIndexes() || null,

			page: App.navStore.get('route') || 'home'
		}
	},

});
