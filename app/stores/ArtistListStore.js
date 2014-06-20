var Flow = require('react-flow')
  , _ = require('lodash')
  , Collection = require('../dal/Collection')
  , Model = require('../dal/Model')
  , appConstants = require('../constants/AppStateConstants')

  , articles = [ 'the', 'el', 'la', 'los', 'las', 'le', 'les'];


module.exports = Flow.defineStore({

	mixins: [  Flow.DataHelperStoreMixin, require('./ApiStoreMixin') ],

	getInitialData: function(options){
		var M = Model.define({
			obj: Model.field({}),
			num: Model.field(Number, {defaultValue: '5'}),
			str: Model.field(String, { nullable: true }),
			str2: Model.field("", { nullable: true }),
			artists: Model.field(
				Collection.extend({
					model: Model.define({ 
						idField: '_id',
						albums: Model.field(Array)
					}),
					url: '/artists'
				}))
		})

		return new M();
	},

	getActions: function(){
		var apiActions = {

			addArtist: function(name){
				var state = this.get()

				this._push('artists', { id: _.uniqueId('_'), text: name });
			},

			loadArtist: function(artistId){
				this.api('/artists/:id', { id: artistId })
			}
		}

		return apiActions;
	},

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
                self._push.apply(self, ['artists'].concat(data) )
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