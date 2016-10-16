const Twilio = require('twilio')

const express = require('express')
const bodyParser = require('body-parser')

let tw = express.Router()
tw.use(bodyParser.urlencoded({extended: false}))
tw.use(bodyParser.json())

class TwilioHandler {
  constructor (sid, token) {
    this.client = new Twilio(sid, token)
    this.callback = undefined
  }

  statusToString (status) {
    return `[${status.type}] ${status.currentLayer}/${status.totalLayer} (${Math.round(status.progress*100)}%) layers`
  }

  messageToResponse (msg) {
    if (msg.includes('status')) {
      let status = this.callback()
      return this.statusToString(status)
    }

    return 'Come again?'
  }

  setStatusCallback (callback) {
    this.callback = callback
  }

  handlePost (req, res) {
    let from = req.body.From
    let to = req.body.To

    let message = req.body.Body.trim()
    let response = this.messageToResponse(message.toLowerCase())

    this.client.messages.create({
      from: to,
      to: from,
      body: response
    }).then(resp => {
      console.log(`Responded to ${from} ("${message}" → "${response}")`)
    }).catch(err => {
      console.error('fb-error', err.message)
    })

    res.status(200).send()
  }
}

let useTwilio = process.env.TWILIO_ACCOUNT_SID !== undefined && process.env.TWILIO_AUTH_TOKEN !== undefined
let myHandler
if (!useTwilio) {
  console.log('$TWILIO_ACCOUNT_SID and/or $TWILIO_AUTH_TOKEN not set, disabling twilio support...')
  console.log('Possible fix:\n\texport TWILIO_ACCOUNT_SID="<SID>"\n\texport TWILIO_AUTH_TOKEN="<TOKEN>"')
} else {
  myHandler = new TwilioHandler(
    process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  tw.post('/msg', (req, res) => myHandler.handlePost(req, res))
}

tw.setStatusCallback = (callback) => {
  if (useTwilio) {
    myHandler.setStatusCallback(callback)
  }
}

module.exports = tw
