const Twilio = require('twilio')

const express = require('express')
const bodyParser = require('body-parser')

let tw = express.Router()
tw.use(bodyParser.urlencoded({extended: false}))
tw.use(bodyParser.json())

class TwilioHandler {
  constructor (sid, token) {
    this.client = new Twilio(sid, token)
  }

  messageToResponse (msg) {
    return 'hey ho let\'s go'
  }

  handlePost (req, res) {
    let from = req.body.From
    let to = req.body.To

    let message = req.body.Body.trim()
    let response = this.messageToResponse(message)

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

if (process.env.TWILIO_ACCOUNT_SID === undefined || process.env.TWILIO_AUTH_TOKEN === undefined) {
  console.log('$TWILIO_ACCOUNT_SID and/or $TWILIO_AUTH_TOKEN not set, disabling twilio support...')
  console.log('Possible fix:\n\texport TWILIO_ACCOUNT_SID="<SID>"\n\texport TWILIO_AUTH_TOKEN="<TOKEN>"')
} else {
  let myHandler = new TwilioHandler(
    process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  tw.post('/msg', (req, res) => myHandler.handlePost(req, res))
}

module.exports = tw
