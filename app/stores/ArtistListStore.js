var Flow = require('react-flow')
  , on = Flow.defineStore.listenFor
  , _ = require('lodash')
  , Collection = Flow.Collection
  , Model = Flow.Model
  , field = Model.field
  , appConstants = require('../constants/AppStateConstants')

  , articles = [ 'the', 'el', 'la', 'los', 'las', 'le', 'les'];

var ArtistEntry = Model.define({
	idField: '_id',
	images: field([ String ]),
	albums: field([ String ])
})

module.exports = Flow.defineStore({

	mixins: [  Flow.DataHelperStoreMixin, require('./ApiStoreMixin') ],

	getInitialData: function(options){

		return Model.create({
			selectedArtist: field( ArtistEntry ),
			artists: 		field( Collection.of(ArtistEntry) )
		});
	},

	actions: [
		on('addArtist', function(name){
			var state = this.get()

			this._push('artists', { id: _.uniqueId('_'), text: name });
		}),

		on('loadArtist', function(artistId){
			this.api('/artists/:id', { id: artistId })
		})
	],


	getIndexes: function(){
		var grouped = _.map(_.groupBy(this.get('artists'), article), function(items, letter){
			return { letter: letter, artists: items}
		})

		return _.sortBy(grouped, 'letter') 
            
        function article(m){
		    return m._id ? woutArticle(m._id).charAt(0).toUpperCase(): '(Unknown Artist)'
	    }
	},

	_authenticated: function(){
		var self = this;
		this.api('/artists')
            .then(function(data){
                self._add('artists', data)
            })
	}
})



function woutArticle(str){
    var r = str
      , lower = str.toLowerCase();
     
    _.each(articles, function(article){
        if ( 0 === lower.indexOf(article + ' ') ) 
            r = str.substring(article.length + 1);
    }) 
    
    return r; 
}