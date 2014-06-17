var React = require('react')
  , _ = require('lodash')
  , artistActions = require('../actions/artistActions');


module.exports = React.createClass({

	render: function() {
		var children = _.map(this.props.artists, function(result) {
	          return <li key={result.id}>{result.text}</li>
	        })

		return (
			<div>
				<button onClick={ this.addArtist}>Add Artist</button>
			  	<ul>{children}</ul>  	
		  	</div>
		);
	},

	addArtist: function(){
		artistActions.addArtist('The National')
	}

});