//////////// FACEIT DISCORD BOT ////////////////

// MODULES

const Discord = require('discord.js');
const client = new Discord.Client();
const getPlayerInfo = require('./models/getPlayerInfo');

// FACEIT & DISCORD TOKENS

const { faceitToken } = require('./config/faceitConfig.json');
const { prefix, token } = require('./config/config.json');

// LOG IN TO DISCORD BOT

client.login(token);

client.once('ready', () => {
  console.log('Ready!');
});

// DISCORD BOT COMMANDS

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  // FACEIT COMMAND

  if (command === 'faceit') {
    (async () => {
      try {
        getPlayerInfo(args, message);
        // ERROR HANDLING
      } catch (err) {
        message.channel.send('No such user, please try again.');
        console.log(err);
        throw err;
      }
    })();
  }
});
