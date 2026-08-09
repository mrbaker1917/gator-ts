import { setUser } from "./config";

type CommandHandler = (cmdName: string, ...args: string[]) => void;

export function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length < 1) {
        console.error("Error: Missing username argument for login command.");
        return;
    }
    const username = args[0];
    setUser(username);
    console.log(`Logged in as ${username}`);
}

export type CommandsRegistry = {
    [commandName: string]: CommandHandler;
};

export function registerCommand(registry: CommandsRegistry, commandName: string, handler: CommandHandler) {
    registry[commandName] = handler;
};

export function runCommand(registry: CommandsRegistry, commandName: string, ...args: string[]) {
    const handler = registry[commandName];
    if (!handler) {
        console.error(`Error: Unknown command '${commandName}'`);
        return;
    }
    handler(commandName, ...args);
}