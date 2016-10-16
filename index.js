const express = require('express')
const webpack = require('webpack')
const config = require('./webpack.config')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

let app = express()
let compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {colors: true}
}))

app.use(webpackHotMiddleware(compiler, {
  log: console.log
}))

let tw = require('./routes/twilio')
app.use('/messenger', tw)

let api = require('./routes/api')
app.use('/api', api)

app.use(express.static(`${__dirname}/static`))

app.get('/*', (req, res) => res.sendFile(`${__dirname}/static/index.html`))

let server = app.listen(3000, () => {
  let host = server.address().address
  let port = server.address().port
  console.log(`Poce running on http://${host}:${port}`)
})
