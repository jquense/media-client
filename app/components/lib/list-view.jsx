var React = require('react')
  , _ = require('lodash');


module.exports = ListView =React.createClass({

	propTypes: {
		data: React.PropTypes.array.isRequired,

		component: React.PropTypes.func,

		itemComponent: React.PropTypes.component.isRequired,
		editComponent: React.PropTypes.component,

		onEdit: React.PropTypes.func,
		onChange: React.PropTypes.func,
		onSave: React.PropTypes.func,
		onDelete: React.PropTypes.func,
	},

	getDefaultProps: function() {
	    return {
	      component: React.DOM.ul,
	    }
  	},

	getInitialState: function(){
		return {
			editing: false
		}
	},

	render: function(){
		var self = this
		  , Item = this.props.itemComponent
		  , Edit = this.props.editComponent
		  , editiable = !!this.props.editComponent
		  , children  = _.map(this.props.data, function(data, idx){
		  		var key = data[self.idField || 'id'] || idx
		  		  , isEditing = self.state.editing === data
		  		  , templ = isEditing
		  		  		? <Edit data={data} finish={ _.bind(self.finish, self, data) }/>
		  		  		: <Item data={data} edit={ _.bind(self.edit, self, data) }/>;

				return <li key={key}>{templ}</li>
			})

		return this.props.component(
			{ className="listview", role="listbox"}
			children
			)
	},

	finish: function(data, idx){
		this.setState({
			editing: false
		})
	},

	edit: function(data, idx){
		this.setState({
			editing: data
		})
	}
})

