var _ = require('lodash')
  , Promise = require('bluebird')
  , action = require('react-flow').actions
  , appConstants = require('../constants/appConstants');

module.exports = {

	authenticate: action.dispatchTo(appConstants.AUTHENICATE),

	start: action.dispatchTo(appConstants.START, function(send){
		send(appConstants.AUTHENICATE)
	})
}




