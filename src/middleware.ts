import { readConfig } from "./config";
import { getUserByName } from "./lib/db/queries/users";
import { User } from "./lib/db/schema";
import { CommandHandler } from "./commands/commands";

type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler{
    return async (cmdName: string,  ...args: string[]) => {
        const cfg = readConfig();
        if (!cfg.currentUserName) {
            throw new Error("You are not logged in.")
        }
        const user = await getUserByName(cfg.currentUserName);
        if (!user) {
            throw new Error(`User ${cfg.currentUserName} not found`);
        }
        await handler(cmdName, user, ...args);
    };
};