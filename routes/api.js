const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')

let api = express.Router()
api.use(bodyParser.json())
api.use(bodyParser.urlencoded({extended: true}))

/*
 * Application class
 */
class JobHandler {
  constructor () {
    this._jobs = []
    this._status = {
      type: 'IDLE',
      currentLayer: -1,
      totalLayer: -1,
      timeLeft: -1,
      timeTotal: -1,
      shutterPos: -1,
      z_position: -1,
      currentJob: undefined
    }
  }

  get jobs () { return this._jobs }
  get status () { return this._status }
  get running () { return this._status.currentJob !== undefined }

  addJob (job) {
    // also starts job
    this._jobs.push(job)
    this.updateStatus()
  }

  updateStatus () {
    this._status.currentJob = this._jobs[this._jobs.length - 1]
  }
}

let jobHandler = new JobHandler()

/*
 * API definitions
 */

api.get('/status', (req, res) => {
  res.json(jobHandler.status)
})

api.get('/jobs', (req, res) => {
  res.json(jobHandler.jobs)
})

api.post('/jobs', (req, res) => {
  if (jobHandler.running) {
    res.status(400).json({message: 'another job is currently running'})
    return
  }

  let required_keys = ['file', 'resin']
  if (!_.isEqual(required_keys.sort(), Object.keys(req.query).sort())) {
    // TODO: note which fields are missing
    res.status(422).json({message: 'missing/incorrect field(s)'})
    return
  }

  jobHandler.addJob({
    resin: req.query.resin,
    file: req.query.file
  })

  res.status(202).json({message: 'job submitted'})
})

// catch non-existing commands
api.get('/*', (req, res) => {
  res.status(400).json({message: 'command not found'})
})
api.post('/*', (req, res) => {
  res.status(400).json({message: 'command not found'})
})
api.put('/*', (req, res) => {
  res.status(400).json({message: 'command not found'})
})
api.delete('/*', (req, res) => {
  res.status(400).json({message: 'command not found'})
})

module.exports = api
