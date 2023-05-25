import { ActivityType } from "discord.js";
import { CSAlert } from "../utils/client";
import config from "../utils/config.json";
import { newSteamUser } from "../utils/SteamUser";

export const onReady = async (client: CSAlert) => {
  console.log("\x1b[35m[CSAlert] \x1b[36mLigado com sucesso!");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client.application?.commands.set(client.commands.map((v: any) => v.data));
  client.user?.setActivity({
    name: "Inventário da Steam...",
    type: ActivityType.Watching,
    url: "https://steamcommunity.com/market",
  });
  for (const conta of config.steam.accounts)
    new newSteamUser().create({
      username: conta.username,
      password: conta.password,
      shared_secret: conta.shared_secret,
      channelId: config.discord.channel_id,
      client: client,
    });
};
