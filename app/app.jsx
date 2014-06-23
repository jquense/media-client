var React = require('react')
  , LibraryStore = require('./stores/ArtistListStore')
  , Library = require('./components/Library.jsx')
  , Playlists = require('./components/Playlists.jsx')
  , flow = require('./lib/Application');
 
window.App = flow.create()

App.routerActions
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

App.libraryStore = new LibraryStore({ 
    refs: [ App.appStore ]
})

App.children = [
  Library,
  Playlists
]

App.appActions.start({
    server: 'http://localhost:80',
    redirectUri: '/auth',
    clientId: 'another_client'
});
