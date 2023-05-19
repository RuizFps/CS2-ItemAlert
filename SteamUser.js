const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const GlobalOffensive = require('globaloffensive');
const SteamCommunity = require('steamcommunity');
const { EmbedBuilder } = require('discord.js');

class newSteamUser {

  /**
   * @param {String} username  O nome de usuário da conta
   * @param {String} password A senha da conta
   * @param {String} shared_secret O Shared Secret da conta
   * @param {String} identity_secret O Identity Secret da conta
   * @param {String} channelId O ID do canal onde o BOT irá notificar. 
   */
    
    create({ username, password, shared_secret, channelId, client }) {
        
        const steamUser = new SteamUser({ promptSteamGuardCode: false });
        const csgo = new GlobalOffensive(steamUser);

        if(shared_secret)
            steamUser.logOn({
                accountName: username,
                password: password,
                twoFactorCode: SteamTotp.generateAuthCode(shared_secret),
            });
        
        if (!shared_secret)
            steamUser.logOn({
                accountName: username,
                password: password,
            });
        
        csgo.on('connectedToGC', () => console.log(`${username} conectado com o Game Coordinator.`));

        steamUser.on('loggedOn', () => {

            console.log(`Logado como: ${username}`);

            steamUser.setPersona(SteamUser.EPersonaState.Online);
            steamUser.gamesPlayed([730]);

        });

    return this.aquireItemScan({ channelId, username, csgo, client });
    }
    aquireItemScan({ channelId, username, csgo, client }) {

        csgo.on('itemAcquired', () => {

            console.log(`A conta ${username} recebeu um novo item!`);

            const channel = client.channels.cache.get(channelId)
            if (!channel) throw new Error(`Canal "${channelId}" não encontrado.`);
      
            channel.send({
                embeds: [new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Você recebeu um novo item!')
                .setDescription(`Você recebeu um novo item na conta: ${username}`)]
            })
        })
    }
}
module.exports = { newSteamUser }