var React = require('react')
  , _ = require('lodash')
  , Link = require('../Link.jsx')
  , artistActions = require('../../actions/artistActions');

 
module.exports = React.createClass({
	
	render: function(){

		return (      
			<Link routeValues={{ action: 'library', method: 'loadArtist', artist_id: this.props.id}}>
				<div>{this.props.id}</div>
			</Link>
		)
	}
})