import {
  CommandInteraction,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { CSAlert } from "./client";

export interface Command {
  data: SlashCommandBuilder;
  execute(
    interaction: CommandInteraction | ChatInputCommandInteraction,
    client: CSAlert
  ): Promise<void>;
}
