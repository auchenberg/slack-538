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

var SlackBot = require('slackbots');

// create a bot
var bot = new SlackBot({
    token: 'xoxb-89062814325-30k102AQ4vRkSC7p4fAxlpZ4', // Add a bot https://my.slack.com/services/new/bot and put the token 
    name: '538'
});

bot.on('start', function() {
    // more information about additional params https://api.slack.com/methods/chat.postMessage
    var params = {
        icon_emoji: ':flag-us:'
    };

    // define channel, where bot exist. You can adjust it there https://my.slack.com/services 
    bot.postMessageToChannel('dapol', 'Hello from 538', params);

});

bot.on('message', function(data) {
    // all ingoing events https://api.slack.com/rtm
    console.log(data);
});