const EventEmitter = require('events')
const fs = require('fs')

const config = require('../printer/config')
const format = require('string-format')
const spawn = require('spawn-promise')

let SerialPort
let serialDevice = '/dev/ttyACM0'

try {
  fs.accessSync(serialDevice, fs.F_OK)
  SerialPort = require('serialport')
} catch (e) {
  console.log('warning using virtual serialport')
  SerialPort = require('virtual-serialport')
  SerialPort.parsers = {
    readline: (foo) => 42
  }
}

let arduino = new SerialPort(serialDevice, {
  baudrate: 9600,
  parser: SerialPort.parsers.readline('\n')
})

function waitForCompletion (port) { // add a timeout?
  return new Promise((resolve, reject) => {
    port.write('G4 P1\n')
    console.log('G4 send')
    port.on('data', (data) => {
      if (data.toString().includes('Z_move_comp')) {
        resolve(data.toString())
      } else {
        console.log(data.toString())
      }
    })

    port.on('error', (err) => {
      reject(err)
    })
  })
}

function send (port, gcode) {
  return new Promise((resolve, reject) => {
    port.write(gcode + '\n')
    console.log('send: ' + gcode)

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

function sendLayers (num) {
  let p = Promise.resolve()
  let layerheight = 2
  for (var i = 0; i < num; i++) {
    let before = config.gcode.layer.before.map((gcode) => format(gcode, {position: i * layerheight}))
    let open = config.gcode.shutter.open.map((gcode) => format(gcode, {position: i * layerheight}))
    let close = config.gcode.shutter.close.map((gcode) => format(gcode, {position: i * layerheight}))
    let after = config.gcode.layer.after.map((gcode) => format(gcode, {position: i * layerheight}))

    let export_layer = `--export-id=layer${i}`

    p = p.then(() => sendAll(arduino, before))
    .then(() => spawn('inkscape', ['--without-gui', '--export-png=/home/pi/test/render.png', export_layer, '--export-id-only', '--export-area-page', '--export-dpi=1000', '--export-background=black', '/home/pi/test/gear_small.svg']))
    .then(() => spawn('avconv', ['-loglevel', 'panic', '-y', '-vcodec', 'png', '-i', '/home/pi/test/render.png', '-vcodec', 'rawvideo', '-f', 'rawvideo', '-pix_fmt', 'rgb32', '-vf', 'pad=1024:768:120:40:blue', '/dev/fb0']))
    .then(() => sendAll(arduino, open))
    .then(() => new Promise((resolve) => setTimeout(resolve, 5000)))
    .then(() => sendAll(arduino, close))
    .then(() => sendAll(arduino, after))
    // this.emit('progress', i / num)
  }
  return p
}

class Controller extends EventEmitter {
  startJob (job, sync = false) {
    if (!sync) {
      console.log('hey ho let\'s go')
      setTimeout(job => this.startJob(job, sync = true))
      return
    }
    console.log('preparing to print')
    // arduino.on('open', function () {
    console.log('### opened')
    arduino.write(config.gcode.start)
    this.emit('start')

    console.log('### sending stuff')

    sendAll(arduino, config.gcode.start)
    .then(() => sendLayers(10))
    .then(() => sendAll(arduino, ['G4 P100']))
    .then(() => sendAll(arduino, config.gcode.end))
    .then(function () { console.log('TADAAAA') })

    this.emit('end')
    arduino.write(config.gcode.end)
    waitForCompletion(arduino)
    this.emit('done')
    // })
  }
}

module.exports.Controller = Controller
