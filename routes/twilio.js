const Twilio = require('twilio')

const express = require('express')
const bodyParser = require('body-parser')

let tw = express.Router()
tw.use(bodyParser.urlencoded({extended: false}))
tw.use(bodyParser.json())

class TwilioHandler {
  constructor () {
    this.client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
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

let myHandler = new TwilioHandler()
tw.post('/msg', (req, res) => myHandler.handlePost(req, res))

module.exports = tw
