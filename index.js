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
    scopes: ['commands', 'bot', 'channels:write', 'channels:read', 'chat:write:bot', 'chat:write:user', 'reactions:read', 'reactions:write'],
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

controller.on('slash_command',function(bot,message) {
    console.log('slash command', bot,message)
    // reply to slash command
    bot.replyPublic(message,'Everyone can see the results of this slash command');
})