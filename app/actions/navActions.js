var navConstants = require('../constants/navigationConstants')
  , createAction = require('react-flow').createActions
  , _ = require('lodash');

var actions = {}

module.exports = createAction(
	_.mapValues(_.invert(navConstants), function(){
		return createAction.passThrough
	})
)




