const fs = require('fs')
const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')

const Controller = require('./printController.js').Controller
const spawn = require('spawn-promise')

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
      progress: -1,
      currentJob: {}
    }

    let resin_root = `${__dirname}/../resins`
    let resin_fname = `${resin_root}/resins.json`
    this._resins = require(path.resolve(resin_fname))

    this._models = []
    let model_root = `${__dirname}/../models`
    for (let name of fs.readdirSync(model_root)) {
      if (name.endsWith('.svg')) {
        this._models.push({
          id: this._models.length,
          file: name,
          name: name.split('.')[0]
        })
      }
    }

    this._controller = new Controller()
    this._controller.on('start', () => this._status.type = State.PRINTING)
    this._controller.on('end', () => this._status.type = State.PROCESSING)
    this._controller.on('done', () => this._status.type = State.IDLE)
    this._controller.on('progress', this.onPrintingProgress.bind(this))
    this._controller.on('shutter', (pos) => this._status.shutterPos = pos)
  }

  get jobs () { return this._jobs }
  get status () { return this._status }
  get running () { return this._status.type !== State.IDLE && this._status.type !== State.PAUSED }
  get resins () { return this._resins }
  get models () { return this._models }

  addJob (job) {
    // also starts job
    this._jobs.push(job)

    this._status.currentLayer = 0
    this._status.totalLayer = 9
    this._status.progress = 0

    this._status.type = State.PROCESSING // state will progress to State.PRINTING eventually
    this._status.currentJob = _.last(this._jobs)

    this._controller.startJob(this._status.currentJob)
  }

  cancelCurrentJob () {
    // state will progress to State.PAUSED eventually
    this._status.type = State.PROCESSING
    this._controller.cancelJob()
  }

  onPrintingProgress (layer, total, z_pos) {
    this._status.progress = layer / total
    this._status.currentLayer = layer
    this._status.totalLayer = total
    this._status.z_position = z_pos
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
    resin: jobHandler.resins[req.query.resin],
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

api.get('/models', (req, res) => {
  res.json(jobHandler.models)
})

api.get('/models/:mid', (req, res) => {
  let mid = req.params.mid
  if (mid < 0 || mid >= jobHandler.models.length) {
    res.status(422).json({message: 'invalid model id'})
    return
  }

  res.json(jobHandler.models[mid])
})

api.get('/models/:mid/layerheights', (req, res) => {
  res.json([2, 5, 9])
})

api.get('/projector/currentImage', (req, res) => {
  let root = `${__dirname}/../models`
  let fname = `${root}/render.png`
  res.sendFile(path.resolve(fname))
})

var showPattern = false
var dpi = 92

api.get('/projector', (req, res) => {
  res.json({
    dpi: 90
  })
})

api.put('/projector/', (req, res) => {
  showPattern = req.query.showPattern !== undefined ? req.query.showPattern : showPattern
  dpi = req.query.dpi !== undefined ? req.query.dpi : dpi
  if (showPattern) {
    spawn('inkscape', ['--without-gui', `--export-png=${__dirname}/../calibration_pattern.png`, '--export-area-page', `--export-dpi=${dpi}`, `${__dirname}/../calibration_pattern.svg`])
    .then(() => spawn('avconv', ['-loglevel', 'panic', '-y', '-vcodec', 'png', '-i', `${__dirname}/../calibration_pattern.png`, '-vcodec', 'rawvideo', '-f', 'rawvideo', '-pix_fmt', 'rgb32', '-vf', 'pad=1024:768:ow/2-iw/2:oh/2-ih/2:black', '/dev/fb0']))
  }
  res.json({})
})

api.get('/resins', (req, res) => {
  res.json(jobHandler.resins)
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

api.getStatus = () => jobHandler.status

module.exports = api
