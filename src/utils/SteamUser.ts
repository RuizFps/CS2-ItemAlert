import { generateAuthCode } from "steam-totp";
import Steam, { EPersonaState } from "steam-user";
import csgo from "globaloffensive";
import { Client, EmbedBuilder, TextChannel, inlineCode } from "discord.js";
import { client } from ".";

export class newSteamUser {
  /**
   * @param {String} username  O nome de usuário da conta
   * @param {String} password A senha da conta
   * @param {String} shared_secret O Shared Secret da conta
   * @param {String} identity_secret O Identity Secret da conta
   * @param {String} channelId O ID do canal onde o BOT irá notificar.
   */

  create(Options: {
    username: string;
    password: string;
    shared_secret: string;
    channelId: string;
    client: Client;
  }) {
    const SteamClient = new Steam();
    const CSGOClient = new csgo(SteamClient);
    if (!Options.shared_secret)
      throw new Error(
        "É necessário o Shared Secret da sua conta para continuar!"
      );

    SteamClient.logOn({
      accountName: Options.username,
      password: Options.password,
      twoFactorCode: generateAuthCode(Options.shared_secret),
    });

    CSGOClient.on("connectedToGC", () => {
      console.log(`${Options.username} conectado com o Game Coordinator.`);

      if (CSGOClient.inventory)
        client.itemCount.set(`${Options.username}`, {
          username: Options.username,
          inventorySize: CSGOClient.inventory?.length,
        });
    });

    SteamClient.on("loggedOn", () => {
      console.log(`Logado como: ${Options.username}`);

      SteamClient.setPersona(EPersonaState.Online);
      SteamClient.gamesPlayed([730]);
    });

    this.aquireItemScan({
      channelId: Options.channelId,
      username: Options.username,
      CSGOClient: CSGOClient,
      client: Options.client,
    });
  }

  aquireItemScan(Options: {
    channelId: string;
    username: string;
    CSGOClient: csgo;
    client: Client;
  }) {
    Options.CSGOClient.on("itemAcquired", () => {
      if (Options.CSGOClient.inventory)
        client.itemCount.set(`${Options.username}`, {
          username: Options.username,
          inventorySize: Options.CSGOClient.inventory?.length,
        });

      console.log(`A conta ${Options.username} recebeu um novo item!`);

      const channel = Options.client.channels.cache.get(
        Options.channelId
      ) as TextChannel;
      if (!channel)
        throw new Error(`Canal "${Options.channelId}" não encontrado.`);

      channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#ff0000")
            .setAuthor({
              name: "Novo item!",
              iconURL: Options.client.user?.avatarURL() ?? "",
            })
            .setDescription(
              `Você recebeu um novo item na conta ${inlineCode(
                Options.username
              )}`
            ),
        ],
      });
    });
  }
}
