var _ = require('lodash')
  , Promise = require('bluebird')
  , actions = require('react-flow').actions


module.exports = {
	addArtist: actions.dispatchTo('addArtist')
}