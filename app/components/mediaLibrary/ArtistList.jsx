var React = require('react')
  , _ = require('lodash')
  , ArtistListItem = require('./ArtistListItem.jsx')
  , artistActions = require('../../actions/artistActions');

 
module.exports = React.createClass({

	propTypes: {
		indexes: React.PropTypes.object.isRequired
	},

	render: function() {
		var self = this
		  , children = _.map(this.props.indexes, function(index){
			return (
				<li>
					<h4 className="index-header">{ index.letter }</h4>
					<ul className='index-item-list row'>
						{ _.map(index.artists, function(artist){
							return (
								<li key={artist.id} className="col-sm-3 artist-item">
									{ArtistListItem(artist)}
								</li>
							)
						})}
					</ul>
				</li>)
		})
		return (
			<ul className='index-list'>
				{ children } 	
		  	</ul>
		);
	},

	addArtist: function(){
		artistActions.addArtist('The National')
	}

});


function chunk(array, chunkSize) {
  var index = 0,
      length = array ? array.length : 0,
      result = [];

  chunkSize = Math.max(+chunkSize || 1, 1);

  while (index < length) result.push(array.slice(index, (index += chunkSize)));
  
  return result;
}