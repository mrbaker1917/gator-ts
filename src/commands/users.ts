import { setUser } from "../config";
import { createUser, getUserByName } from "../lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];
  const existingUser = await getUserByName(userName)
  if (!existingUser) {
    throw new Error("user is not registered!")
  }
  setUser(userName);
  console.log("User switched successfully!");
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];
  const existingUser = await getUserByName(userName);
  if (existingUser) {
    throw new Error(`User with name "${userName}" already exists.`);
  }

  await createUser(userName);
  setUser(userName);
  console.log("User registered successfully!");
}