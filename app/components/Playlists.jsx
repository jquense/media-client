var React = require('react')
  , ArtistList   = require('./mediaLibrary/ArtistList.jsx')
  , Link = require('./Link.jsx')
  , MediaContent = require('./MediaContent.jsx')
  , StoreWatch = require('react-flow').StoreWatchMixin;


module.exports = MediaApp = React.createClass({

	mixins: [ 
		StoreWatch(App.libraryStore)
	],

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
			indexes: App.libraryStore.getIndexes() || null,
		}
	},

});
