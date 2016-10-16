const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')

const Controller = require('./printController.js').Controller

let api = express.Router()
api.use(bodyParser.json())
api.use(bodyParser.urlencoded({extended: true}))

/*
 * Application class
 */
const State = {
  IDLE: 'IDLE',
  PROCESSING: 'PROCESSING',
  PAUSED: 'PAUSED',
  PRINTING: 'PRINTING'
}

class JobHandler {
  constructor () {
    this._jobs = []
    this._status = {
      type: State.IDLE,
      currentLayer: -1,
      totalLayer: -1,
      timeLeft: -1,
      timeTotal: -1,
      shutterPos: -1,
      z_position: -1,
      currentJob: {}
    }

    this._controller = new Controller()
    this._controller.on('start', () => this._status.type = State.PRINTING)
    this._controller.on('end', () => this._status.type = State.PROCESSING)
    this._controller.on('done', () => this._status.type = State.IDLE)
    this._controller.on('progress', this.onPrintingProgress.bind(this))
  }

  get jobs () { return this._jobs }
  get status () { return this._status }
  get running () { return this._status.type !== State.IDLE && this._status.type !== State.PAUSED }

  addJob (job) {
    // also starts job
    this._jobs.push(job)

    this._status.type = State.PROCESSING // state will progress to State.PRINTING eventually
    this._status.currentJob = _.last(this._jobs)

    this._controller.startJob(this._status.currentJob)
  }

  cancelCurrentJob () {
    // state will progress to State.PAUSED eventually
    this._status.type = State.PROCESSING
  }

  onPrintingProgress (perc) {
    console.log(perc)
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

api.post('/cancelCurrentJob', (req, res) => {
  if (!jobHandler.running) {
    res.status(400).json({message: 'no job is currently running'})
    return
  }

  jobHandler.cancelCurrentJob()
  res.status(202).json({message: 'job canceled'})
})

api.get('/projector/currentImage', (req, res) => {
  let root = `${__dirname}/../models`
  let fname = `${root}/render.png`
  res.sendFile(path.resolve(fname))
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
