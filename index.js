const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const GlobalOffensive = require('globaloffensive');
const SteamCommunity = require('steamcommunity');
const Discord = require('discord.js');
const config = require('./config.json');
const { Client, Intents, MessageEmbed } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

// Discord v14
const client = new Discord.Client({ intents: [
  Discord.GatewayIntentBits.Guilds,
  Discord.GatewayIntentBits.GuildMessages
]})

const steamUser = new SteamUser({
  promptSteamGuardCode: false,
});

const csgo = new GlobalOffensive(steamUser);
const community = new SteamCommunity();

steamUser.logOn({
  accountName: config.steam.username,
  password: config.steam.password,
  twoFactorCode: SteamTotp.generateAuthCode(config.steam.shared_secret),
});

steamUser.on('loggedOn', () => {
  console.log('Logged in to Steam!');
  steamUser.setPersona(SteamUser.EPersonaState.Online);
  steamUser.gamesPlayed([730]);
});

csgo.on('connectedToGC', () => {
  console.log('Connected to CS:GO Game Coordinator!');
});

steamUser.on('webSession', (sessionID, cookies) => {
  community.setCookies(cookies);
  community.startConfirmationChecker(10000, config.steam.identity_secret);
});

csgo.on('itemAcquired', item => {
  console.log('Você recebeu um novo item! ');
  const channel = client.channels.cache.get(config.discord.channel_id);

  if (!channel) {
    console.error(`Channel ${config.discord.channel_id} not found.`);
    return;
  }

  const embed = new Discord.EmbedBuilder()
    .setColor('#ff0000')
    .setTitle('Você recebeu um novo item!')
    .setDescription(`Voce recebeu um novo item`)

  channel.send({ embeds: [embed] })
    .catch(console.error);
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(config.discord.token);
