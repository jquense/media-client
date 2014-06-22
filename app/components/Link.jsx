var React = require('react')
  , navigate = require('../actions/navActions').route_navigate;


module.exports = Link = React.createClass({

	render: function() {
		var route = this.props.route
		  , params = this.props.routeValues || []
		  , query  = this.props.routeQuery || {}
		  , href = this.props.href || App.navStore.getUrl(route, params, query)

		return this.transferPropsTo(
			<a href={href} onClick={this._onClick}>{this.props.children}</a>
		);
	},

	_onClick: function(e){
		e.preventDefault()
		navigate(e.target.getAttribute('href'), { replace: this.props.replace })
		this.props.onClick && this.props.onClick(e);
	}

});
