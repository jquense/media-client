var _ = require('lodash')
  , Promise = require('bluebird')
  , createAction = require('react-flow').createActions
  , appConstants = require('../constants/AppStateConstants');

var actions = {}

actions[appConstants.AUTHENICATE] = createAction.passThrough

module.exports = createAction(actions)




