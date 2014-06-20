var React = require('react')
  , AppStateStore = require('./stores/AppStateStore')
  , ArtistList = require('./stores/ArtistListStore');
 
window.App = {}

App.appStore = new AppStateStore({
	server: 'http://localhost:80',
	redirectUri: '/auth',
	clientId: 'another_client'
})

App.artistListStore = new ArtistList({ 
  	refs: [ App.appStore ]
})

var MediaApp = require('./components/MediaApp.jsx')

React.renderComponent(
    <MediaApp />,
    document.body
);