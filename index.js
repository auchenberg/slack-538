'use strict'

var Botkit = require('botkit')
var fivethirtyeight = require('./fivethirtyeight')

var redisURL = url.parse(process.env.REDISCLOUD_URL);
var redisConfig = {
    namespace: 'slack-538',
    host: redisURL.hostname,
    port: redisURL.port,
    auth_pass: redisURL.auth.split(":")[1]
}

var controller = Botkit.slackbot({
  storage: require('botkit-storage-redis')(redisConfig)
})

controller.configureSlackApp({
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
        slashCommand.replyPublic(message, {
            attachments: [{
                title: 'Most recent forecast',
                image_url: forecastImageUrl,
            }]
        })
      })

      break

    default:
      slashCommand.replyPublic(message, "I'm afraid I don't know how to " + message.command + ' yet.')

  }
})
