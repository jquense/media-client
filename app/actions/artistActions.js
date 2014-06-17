var _ = require('lodash')
  , Promise = require('bluebird')
  , createAction = require('react-flow').createActions


module.exports = createAction({
	addArtist: createAction.passThrough
})