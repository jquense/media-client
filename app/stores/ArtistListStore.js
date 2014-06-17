var ApiStore = require('./ApiStore')
  , _ = require('lodash');

module.exports = ApiStore.define({

	getInitialData: function(){
		return {
			artists: [
				{ id: 0, text: 'Fallout Boy'},
				{ id: 1, text: 'The Gaslight Anthem'},
				{ id: 2, text: 'Manchester Orchestra'},
				{ id: 3, text: 'N*Sync'},
			]
		}
	},

	getArtists: function(){
		return this.get()
	},

	actions: {

		addArtist: function(name){
			var state = this.get()

			this._push('artists', { id: _.uniqueId('_'), text: name });
		}
	}
})