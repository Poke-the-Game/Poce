var express = require('express')
var webpack = require('webpack')
var config = require('./webpack.config')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')

var app = express()
var compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {colors: true}
}))

app.use(webpackHotMiddleware(compiler, {
  log: console.log
}))

var api = require('./routes/api')
app.use('/api', api)

app.use(express.static(__dirname + '/static'))

app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/static/index.html')
})

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('poce running at http://%s:%s', host, port)
})
