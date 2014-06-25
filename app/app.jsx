var React = require('react')
  , LibraryStore = require('./stores/ArtistListStore')
  , Route = require('react-nested-router').Route
  , flow = require('./lib/Application');
 
window.App = flow.create()



// App.routerActions
//     .map(function(){

//         this.actions('library', function() {

//             this.method('loadArtist', [
//                 '', 
//                 'artists/:artist_id?'
//             ])

//             //this.route('/albums/:album_id?', 'library')
//         })

//         this.actions('playlists')
//     })

// App.libraryStore = new LibraryStore({ 
//     refs: [ App.appStore ]
// })

var Library = require('./components/Library.jsx')
  , Playlists = require('./components/Playlists.jsx')
var Link = require('react-nested-router').Link;

var App = React.createClass({
  render: function() {
    return (
      <div>
        <ul>
          <li><Link to="about">About</Link></li>
          <li><Link to="users">Users</Link></li>
          <li><Link to="user" userId="123">User 123</Link></li>
        </ul>
        {this.props.activeRoute}
      </div>
    );
  }
});

var About = React.createClass({
  render: function() {
    return <h2>About</h2>;
  }
});

var Users = React.createClass({
  render: function() {
    return (
      <div>
        <h2>Users</h2>
        {this.props.activeRoute}
      </div>
    );
  }
});

var User = React.createClass({
  render: function() {
    return <div>{this.props.params.userId}</div>
  }
});

React.renderComponent( (
  <Route handler={App}>
    <Route name="about" handler={About}/>
    <Route name="users" path="/user" handler={Users}>
      <Route name="user" path=":userId" handler={User}/>
    </Route>
  </Route>
), document.body);



// App.component = React.createClass({

//   childContextTypes: {
//     app: React.PropTypes.object
//   },

//   getChildContext: function() {
//     return { app: App };
//   },

//   componentWillMount: function() { 
//     App.routerStore.listen(this._onRouteChange); 
//   }, 

//   componentWillUnmount: function() { 
//     App.routerStore.stopListening(this._onRouteChange); 
//   },

//   render: function(){

//     return (
//       <div>
//         <Library/>
//         <Playlists/>
//       </div>
//     )
//   },

//   _onRouteChange: function(){
//     this.setState(App.routerStore.get())
//   }
// })

// App.appActions.start({
//     server: 'http://localhost:80',
//     redirectUri: '/auth',
//     clientId: 'another_client'
// });
