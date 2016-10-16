const EventEmitter = require('events')
const fs = require('fs')

const config = require('../printer/config')
const format = require('string-format')
const spawn = require('spawn-promise')

let SerialPort
let serialDevice = '/dev/ttyACM0'
let virtual = false

try {
  fs.accessSync(serialDevice, fs.F_OK)
  SerialPort = require('serialport')
} catch (e) {
  console.log('[warning] using virtual serialport')
  virtual = true
  SerialPort = require('virtual-serialport')
  SerialPort.parsers = {
    readline: (foo) => 42
  }
}

let arduino = new SerialPort(serialDevice, {
  baudrate: 9600,
  parser: SerialPort.parsers.readline('\n')
})

if (virtual) {
  arduino.on('dataToDevice', (data) => {
    // console.log('Answering:', data)
    arduino.writeToComputer(data)
  })
}

function send (port, gcode) {
  return new Promise((resolve, reject) => {
    port.write(gcode + '\n')

    let received = (data) => {
      // console.log('received: ' + data)
      if (data.toString().includes(gcode)) {
        console.log('resolve ' + gcode)
        port.removeListener('data', received)
        resolve(data.toString())
      }
    }
    port.on('data', received)

    port.once('error', (err) => {
      reject(err)
    })
  })
}

function sendAll (port, gcodes) {
  return gcodes.reduce((p, gcode) => p.then(() => send(port, gcode)), Promise.resolve())
}

class Controller extends EventEmitter {
  startJob (job, sync = false) {
    if (!sync) {
      setTimeout(() => this.startJob(job, sync = true))
      return
    }

    this.emit('start')
    sendAll(arduino, config.gcode.start)
    .then(() => this.sendLayers(job, 10))
    .then(() => sendAll(arduino, ['G4 P100']))
    .then(() => this.emit('end'))
    .then(() => sendAll(arduino, config.gcode.end))
    .then(() => this.emit('done'))
  }

  sendLayers (job, num) {
    let p = Promise.resolve()
    let layerheight = 2

    let root = `${__dirname}/../models`
    let fb_device = '/dev/fb0'
    let fname = 'gear_small.svg'

    for (var i = 0; i < num; i++) {
      let before = config.gcode.layer.before.map((gcode) => format(gcode, {position: i * layerheight}))
      let open = config.gcode.shutter.open.map((gcode) => format(gcode, {position: i * layerheight}))
      let close = config.gcode.shutter.close.map((gcode) => format(gcode, {position: i * layerheight}))
      let after = config.gcode.layer.after.map((gcode) => format(gcode, {position: i * layerheight}))

      let export_layer = `--export-id=layer${i}`
      let currentLayer = i
      let totalLayer = num - 1
      let z_pos = i * layerheight

      p = p.then(() => sendAll(arduino, before))
      .then(() => spawn('inkscape', ['--without-gui', `--export-png=${root}/render.png`, export_layer, '--export-id-only', '--export-area-page', '--export-dpi=1000', '--export-background=black', `${root}/${fname}`]))
      .then(() => spawn('avconv', ['-loglevel', 'panic', '-y', '-vcodec', 'png', '-i', `${root}/render.png`, '-vcodec', 'rawvideo', '-f', 'rawvideo', '-pix_fmt', 'rgb32', '-vf', 'pad=1024:768:120:40:black', fb_device]))
      .then(() => sendAll(arduino, open))
      .then(() => this.emit('shutter', 'open'))
      .then(() => new Promise((resolve) => setTimeout(resolve, job.resin.attributes.cureTime)))
      .then(() => sendAll(arduino, close))
      .then(() => this.emit('shutter', 'close'))
      .then(() => sendAll(arduino, after))
      .then(() => this.emit('progress', currentLayer, totalLayer, z_pos))
    }
    return p
  }
}

module.exports.Controller = Controller
