const express = require('express')
const bodyParser = require('body-parser')

let api = express.Router()
api.use(bodyParser.json())
api.use(bodyParser.urlencoded({extended: true}))

api.get('/ping', (req, res) => {
  res.json({ping: 'pong'})
})

/* API GOES HERE ;) */

api.get('/*', (req, res) => {
  res.status(400).json({reason: 'command not found'})
})
api.post('/*', (req, res) => {
  res.status(400).json({reason: 'command not found'})
})
api.put('/*', (req, res) => {
  res.status(400).json({reason: 'command not found'})
})
api.delete('/*', (req, res) => {
  res.status(400).json({reason: 'command not found'})
})

module.exports = api
