var React = require('react')
  , _ = require('lodash')
  , Link = require('../Link.jsx')
  , artistActions = require('../../actions/artistActions');

 
module.exports = React.createClass({
	
	render: function(){

		return (      
			<Link route='artists' routeValues={{ artist_id: this.props.id}}>
				<div>{this.props.id}</div>
			</Link>
		)
	}
})