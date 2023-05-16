const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const GlobalOffensive = require('globaloffensive');
const SteamCommunity = require('steamcommunity');
const Discord = require('discord.js');
const config = require('./config.json');
const { Client, Intents, EmbedBuilder } = require('discord.js');

const client = new Discord.Client({ intents: [
  Discord.GatewayIntentBits.Guilds,
  Discord.GatewayIntentBits.GuildMessages
]});
const steamUsers = [];

for (const account of config.steam.accounts) {
  const steamUser = new SteamUser({ promptSteamGuardCode: false });

  steamUser.logOn({
    accountName: account.username,
    password: account.password,
    twoFactorCode: SteamTotp.generateAuthCode(account.shared_secret),
  });

  steamUser.on('loggedOn', () => {
    console.log(`Logged in to Steam account: ${account.display_name}`);
    steamUser.setPersona(SteamUser.EPersonaState.Online);
    steamUser.gamesPlayed([730]);
  });

  const csgo = new GlobalOffensive(steamUser);
  const community = new SteamCommunity();

  csgo.on('connectedToGC', () => {
    console.log(`Connected to CS:GO Game Coordinator - ${account.display_name}`);
  });

  steamUser.on('webSession', (sessionID, cookies) => {
    community.setCookies(cookies);
    community.startConfirmationChecker(10000, account.identity_secret);
  });

  csgo.on('itemAcquired', (item) => {
    console.log(`A conta ${account.display_name} recebeu um novo item!`);
    const channel = client.channels.cache.get(config.discord.channel_id);

    if (!channel) {
      console.error(`Channel ${config.discord.channel_id} not found.`);
      return;
    }

    const embed = new Discord.EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('Você recebeu um novo item!')
      .setDescription(`Você recebeu um novo item na conta: ${account.display_name}`);

    channel.send({ embeds: [embed] })
      .catch(console.error);
  });

  steamUsers.push({ steamUser, csgo, community, account });
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(config.discord.token);