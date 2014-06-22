var React = require('react')
  , AppStateStore = require('./stores/AppStateStore')
  , LibraryStore = require('./stores/ArtistListStore')
  , flow = require('./lib/Application');
 
window.App = flow.create()

App.appStore = new AppStateStore({
    server: 'http://localhost:80',
	redirectUri: '/auth',
	clientId: 'another_client'
})

App.libraryStore = new LibraryStore({ 
  	refs: [ App.appStore ]
})

App.router
    .map(function(){

        this.actions('library', function() {

            this.method('loadArtist', [
                '', 
                'artists/:artist_id?'
            ])

            this.method('albums', '/albums/:album_id?')
        })

        this.actions('playlists')
    })
    .start();



var MediaApp = require('./components/MediaApp.jsx')

React.renderComponent(
    <MediaApp />,
    document.body
);