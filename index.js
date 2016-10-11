'use strict'

var Botkit = require('botkit')
var fivethirtyeight = require('./fivethirtyeight')
var url = require('url')

var redisURL = url.parse(process.env.REDISCLOUD_URL)
var redisConfig = {
  namespace: 'slack-538',
  host: redisURL.hostname,
  port: redisURL.port,
  auth_pass: redisURL.auth.split(':')[1]
}

var controller = Botkit.slackbot({
  storage: require('botkit-storage-redis')(redisConfig)
})

controller.configureSlackApp({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  scopes: ['commands', 'bot', 'chat:write:bot']
})

controller.setupWebserver(process.env.PORT, (err, webserver) => {
  controller.createWebhookEndpoints(controller.webserver)
  controller.createOauthEndpoints(controller.webserver,  (err, req, res) => {
    if (err) {
      res.status(500).send('ERROR: ' + err)
    } else {
      res.send('Success!')
    }
  })
})

controller.on('slash_command', (slashCommand, message) => {
  switch (message.command) {
    case '/538':
      fivethirtyeight.getForecast().then(forecastImageUrl => {
        console.log('getForecast.success', forecastImageUrl)
        slashCommand.replyPublic(message, {
          text: 'Latest presidential polling forecasts from fivethirtyeight.com',
          attachments: [{
            image_url: forecastImageUrl
          }]
        })
      }).catch(err => {
        slashCommand.replyPrivate(message, 'Something went wrong', err)
        console.log('getForecast.err', err)
      })

      break

    default:
      slashCommand.replyPublic(message, "I'm afraid I don't know how to " + message.command + ' yet.')
  }
})
