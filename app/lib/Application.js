var React = require('react')
  , Router = require('./Router')

module.exports = {
	create: function(){
		var app = new Application

		app.router = new Router({ pushState: true, hash: true });
		app.router.store
			.listen(function(){
				var location = app.router.store.get()


			})

		return app
	}
}


function Application(){}


Application.prototype = {

	get: function(key, type){
		key = key + type.charAt(0).toUpperCase() + type.substr(1)

		return this[key]
	}
}