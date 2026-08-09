import { readConfig, setUser } from "./config";
import { handlerLogin, registerCommand, runCommand } from "./commands.js";
import type { CommandsRegistry } from "./commands.js";
import process from "process";

function main() {
    const commandReg: CommandsRegistry = {} as CommandsRegistry;
    registerCommand(commandReg, "login", handlerLogin);
    if (process.argv.length < 4) {
        console.error("Error: Missing command argument.");
        process.exit(1);
        return;
    }
    const commandName = process.argv[2];
    const commandArgs = process.argv.slice(3);
    runCommand(commandReg, commandName, ...commandArgs);
}

main();