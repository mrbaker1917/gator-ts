import {
  type CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands.js";
import { handlerListUsers, handlerLogin, handlerRegister } from "./commands/users.js";
import { handlerReset } from "./commands/reset.js";
import { handlerAgg } from "./commands/aggregate";
import { handlerAddFeed, handlerListFeeds } from "./commands/feeds";
import { follow, following } from "./commands/feed-follows.js"
import { middlewareLoggedIn } from "./middleware.js";

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("usage: cli <command> [args...]");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  const commandsRegistry: CommandsRegistry = {};

  registerCommand(commandsRegistry, "login", handlerLogin);
  registerCommand(commandsRegistry, "register", handlerRegister);
  registerCommand(commandsRegistry, "reset", handlerReset);
  registerCommand(commandsRegistry, "users", handlerListUsers);
  registerCommand(commandsRegistry, "agg", handlerAgg);
  registerCommand(commandsRegistry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(commandsRegistry, "feeds", handlerListFeeds);
  registerCommand(commandsRegistry, "follow", middlewareLoggedIn(follow));
  registerCommand(commandsRegistry, "following", middlewareLoggedIn(following));

  try {
    await runCommand(commandsRegistry, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName}: ${err.message}`);
    } else {
      console.error(`Error running command ${cmdName}: ${err}`);
    }
    process.exit(1);
  }
  process.exit(0);
}

main();
