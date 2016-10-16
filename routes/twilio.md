# How to use twilio

## Setup

Follow difficult process partly described [here](https://www.twilio.com/docs/api/notifications/guides/messenger-notifications#complete-facebook-app-configuration).
Furthermore install version `^3.0.0-rc.13` of the twilio module(as of now):

```bash
npm install twilio@^3.0.0-rc.13
```

## Usage

Download [ngrok](https://ngrok.com/download) and start it together with the nodejs server in order to make it (`localhost`) accessible to facebook.

```bash
./ngrok http <port of nodejs server>
```

The remote url displayed by ngrok together with the RESTful resource (`<ngrok url>/messenger/msg`) must be put as `REQUEST URL` (POST) in the `Authenticate for Facebook Messaging` on [twilio](https://www.twilio.com/console/sms/settings).

The twilio wrapper in `twilio.js` assumes that the following two environment variables are set appropriately:

```bash
export TWILIO_ACCOUNT_SID="<SID>"
export TWILIO_AUTH_TOKEN="<TOKEN>"
```

In order to communicate with the server, messages have to be sent to the [JHack16f](https://www.facebook.com/pocetheprinter/) facebook group.
