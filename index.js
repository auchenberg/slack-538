// var webshot = require('webshot')
// var fs = require('fs')

// var options = {
//   shotOffset: {
//     top: 340,
//     left: 250,
//     right: 250,
//     bottom: 550
//   },
//   shotSize: { 
//     width: 'window',
//     height: 'window'
//   }
// }

// var renderStream = webshot('http://projects.fivethirtyeight.com/2016-election-forecast/', options)

// var file = fs.createWriteStream('538.png', {encoding: 'binary'});

// renderStream.on('data', function(data) {
//   file.write(data.toString('binary'), 'binary');
// });

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/
            
This is a sample Slack Button application that provides a custom
Slash command.
This bot demonstrates many of the core features of Botkit:
*
* Authenticate users with Slack using OAuth
* Receive messages using the slash_command event
* Reply to Slash command both publicly and privately
# RUN THE BOT:
  Create a Slack app. Make sure to configure at least one Slash command!
    -> https://api.slack.com/applications/new
  Run your bot from the command line:
    clientId=<my client id> clientSecret=<my client secret> port=3000 node bot.js
    Note: you can test your oauth authentication locally, but to use Slash commands
    in Slack, the app must be hosted at a publicly reachable IP or host.
# EXTEND THE BOT:
  Botkit has many features for building cool and useful bots!
  Read all about it here:
    -> http://howdy.ai/botkit
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var Botkit = require('botkit');

if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  console.log('Error: Specify clientId clientSecret and port in environment');
  process.exit(1);
}

var controller = Botkit.slackbot({
  json_file_store: './db_slackbutton_slashcommand/',
}).configureSlackApp({
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    scopes: ['commands'],
  });


controller.setupWebserver(process.env.PORT,function(err,webserver) {

  controller.createWebhookEndpoints(controller.webserver);

  controller.createOauthEndpoints(controller.webserver,function(err,req,res) {
    if (err) {
      res.status(500).send('ERROR: ' + err);
    } else {
      res.send('Success!');
    }
  });
});

controller.on('538',function(bot,message) {

  bot.replyPublic(message,'<@' + message.user + '> is cool!');
  bot.replyPrivate(message,'*nudge nudge wink wink*');

});