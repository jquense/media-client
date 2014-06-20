var React = require('react')
  , _ = require('lodash')
  , artistActions = require('../../actions/artistActions');

 

module.exports = React.createClass({
	
	render: function(){

		return (      
			<li key="{ this.props._id}" className="artist-item col-sm-3">

			</li>	
		)
	}
})