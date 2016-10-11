'use strict'

var Botkit = require('botkit')
var fivethirtyeight = require('./fivethirtyeight')

if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  console.log('Error: Specify clientId clientSecret and port in environment')
  process.exit(1)
}

var controller = Botkit.slackbot({
  json_file_store: './db_slackbutton_slashcommand/'
}).configureSlackApp({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  scopes: ['commands', 'bot', 'chat:write:bot', 'chat:write:user', 'reactions:read', 'reactions:write']
})

controller.setupWebserver(process.env.PORT, function (err, webserver) {
  controller.createWebhookEndpoints(controller.webserver)
  controller.createOauthEndpoints(controller.webserver, function (err, req, res) {
    if (err) {
      res.status(500).send('ERROR: ' + err)
    } else {
      res.send('Success!')
    }
  })
})

controller.on('slash_command', function (slashCommand, message) {
  console.log('slash_command', slashCommand, message)

  switch (message.command) {

    case '/538':

      // if (message.token !== process.env.VERIFICATION_TOKEN) return; //just ignore it.
      slashCommand.replyPrivate(message, 'Contacting 538. Stay tuned...')

      fivethirtyeight.getForecast().then(forecastImageUrl => {
        slashCommand.replyPublic(message, '538 graph coming here', {
            attachments: [{
                image_url: forecastImageUrl,
            }]
        })
      })

      break

    default:
      slashCommand.replyPublic(message, "I'm afraid I don't know how to " + message.command + ' yet.')

  }
})
