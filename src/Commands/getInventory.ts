import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  inlineCode,
} from "discord.js";
import { Command } from "../utils/command";

export = {
  data: new SlashCommandBuilder()
    .setName("inventário")
    .setDescription("Veja a quantidade de items no seu inventário!")
    .addSubcommand((s) =>
      s
        .setName("individual")
        .setDescription("Veja a quantidade de items em cada conta individual")
        .addStringOption((s) =>
          s
            .setName("nickname")
            .setDescription("Insira o nome de usuário da conta.")
            .setRequired(true)
        )
    )
    .addSubcommand((s) =>
      s
        .setName("geral")
        .setDescription("Veja a quantidade de items de todas contas")
    ),
  async execute(interaction: ChatInputCommandInteraction, client) {
    if (interaction.options.getSubcommand() === "individual") {
      const nickname = interaction.options.getString("nickname");
      const inventory = client.itemCount
        .get(`${nickname}`)
        ?.inventorySize.toString();

      //required but still null...
      //this first if statement is just dumb, it'll never trigger.
      //thanks Discord.js

      if (!nickname) return;

      if (!inventory)
        return interaction.reply({
          content: "Essa conta não existe!",
          ephemeral: true,
        });

      interaction.reply({
        content: `A conta ${inlineCode(nickname)} possui ${inlineCode(
          inventory
        )} items!`,
        ephemeral: true,
      });
    }
    
    if (interaction.options.getSubcommand() === "geral") {
      client.itemCount.forEach((e) => {
        interaction.reply({
          content: `A conta ${inlineCode(e.username)} possui ${inlineCode(
            e.inventorySize.toString()
          )} items!`,
          ephemeral: true,
        });
      });
    }

  },
} as Command;
