var express = require('express')
var bodyParser = require('body-parser')

var api = express.Router()
api.use(bodyParser.json())
api.use(bodyParser.urlencoded({extended: true}))

api.get('/ping', function (req, res) {
  res.json({ping: 'pong'})
})

/* API GOES HERE ;) */

api.get('/*', function (req, res) {
  res.status(400).json({reason: 'command not found'})
})
api.post('/*', function (req, res) {
  res.status(400).json({reason: 'command not found'})
})
api.put('/*', function (req, res) {
  res.status(400).json({reason: 'command not found'})
})
api.delete('/*', function (req, res) {
  res.status(400).json({reason: 'command not found'})
})

module.exports = api
