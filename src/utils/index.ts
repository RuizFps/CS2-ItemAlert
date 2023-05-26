import { CSAlert } from "./client";
import { Events } from "discord.js";
import { handler } from "./handler";
import { onReady } from "../eventHandlers/onReady";
import { onInteraction } from "../eventHandlers/onInteraction";
const client = new CSAlert();
client.login();
handler();

client.once(Events.ClientReady, async () => await onReady(client));
client.on(Events.InteractionCreate, async (interaction) => {
  await onInteraction(interaction, client);
});

export { client };
