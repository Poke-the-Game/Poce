var SerialPort = require('serialport')
var serialPort = new SerialPort('/dev/ttyACM0', {
  baudrate: 9600,
  parser: SerialPort.parsers.readline('\n')
})

serialPort.on('open', function () {
  console.log('open')
  serialPort.on('data', function (data) {
    console.log('received')
    console.log(data)
  })
  setInterval(function () {
    console.log('sending')
    serialPort.write('G0 Z10 F300\n')
  }, 1000)
})
