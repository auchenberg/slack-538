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
    scopes: ['commands', 'bot', 'chat:write:bot', 'chat:write:user', 'reactions:read', 'reactions:write'],
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

controller.on('slash_command', function (slashCommand, message) {

    console.log('slash_command', slashCommand, message)

    switch (message.command) {
        case "/echo": //handle the `/echo` slash command. We might have others assigned to this app too!
            // The rules are simple: If there is no text following the command, treat it as though they had requested "help"
            // Otherwise just echo back to them what they sent us.

            // but first, let's make sure the token matches!
            //if (message.token !== process.env.VERIFICATION_TOKEN) return; //just ignore it.

            // if no text was supplied, treat it as a help command
            if (message.text === "" || message.text === "help") {
                slashCommand.replyPrivate(message,
                    "I echo back what you tell me. " +
                    "Try typing `/echo hello` to see.");
                return;
            }

            // If we made it here, just echo what the user typed back at them
            //TODO You do it!
            slashCommand.replyPublic(message, "1", function() {
                slashCommand.replyPublicDelayed(message, "2").then(slashCommand.replyPublicDelayed(message, "3"));
            });

            break;

        case "/538":
            slashCommand.replyPublic(message, "538 graph coming here");
            break;

        default:
            slashCommand.replyPublic(message, "I'm afraid I don't know how to " + message.command + " yet.");

    }

});
