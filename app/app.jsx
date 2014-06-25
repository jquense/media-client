var React = require('react')
  , Link = require('./components/Link.jsx')
  , LibraryStore = require('./stores/ArtistListStore')
 // , Route = require('react-nested-router').Route
  , flow = require('./lib/Application');
 
window.App = flow.create()





// App.libraryStore = new LibraryStore({ 
//     refs: [ App.appStore ]
// })

var Library = require('./components/Library.jsx')
  , Playlists = require('./components/Playlists.jsx')
//var Link = require('react-nested-router').Link;
// var App2 = React.createClass({
//   render: function() {
//     return (
//       <div>
//         <ul>
//           <li><Link to="about">About</Link></li>
//           <li><Link to="users">Users</Link></li>
//           <li><Link to="user" userId="123">User 123</Link></li>
//         </ul>
//         {this.props.activeRoute}
//       </div>
//     );
//   }
// });

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

App.component = React.createClass({

  childContextTypes: {
    app: React.PropTypes.object
  },

  getInitialState: function(){
    return App.routerStore.get()
  },
  getChildContext: function() {
    return { app: App };
  },

  componentWillMount: function() { 
    App.routerStore.listen(this._onRouteChange); 
  }, 

  componentWillUnmount: function() { 
    App.routerStore.stopListening(this._onRouteChange); 
  },

  render: function(){
    return (
      <div>
        {this.props.activeRoute}
      </div>
    )
  },

  _onRouteChange: function(){
    this.setState(App.routerStore.get())
  }
})

App.routerActions
    .map(function(){

        this.resource('users', Users, function() {
            this.route('User', User, '/users/:userId?')
            

            //this.route('/albums/:album_id?', 'library')
        })
        
        this.route('about', About)
    })


App.appActions.start({
    server: 'http://localhost:80',
    redirectUri: '/auth',
    clientId: 'another_client'
});
