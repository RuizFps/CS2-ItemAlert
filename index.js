const config = require('./config.json');
const { Client } = require('discord.js');
const { newSteamUser } = require("./SteamUser")

const client = new Client({ intents: 3276799 });

client.once('ready', () => console.log(`Logado no Discord como ${client.user.tag}!`));

for (const conta of config.steam.accounts)
  new newSteamUser().create(
    {
      username: conta.username,
      password: conta.password,
      shared_secret: conta.shared_secret,
      channelId: config.discord.channel_id,
      client: client
    })
client.login(config.discord.token);
