import { Client, Collection } from "discord.js";
import { Command } from "./command";
import config from "../utils/config.json";

interface accountCollection {
  username: string;
  inventorySize: number;
}

class CSAlert extends Client {
  commands: Collection<string, Command> = new Collection();
  itemCount: Collection<string, accountCollection> = new Collection();
  constructor() {
    super({ intents: 3276799 });
  }

  login() {
    return super.login(config.discord.token);
  }
}
export { CSAlert };
