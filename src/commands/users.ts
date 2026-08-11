import { readConfig, setUser } from "../config";
import { createUser, getUserByName, getUsers } from "../lib/db/queries/users";

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

export async function handlerListUsers(_: string) {
  const users = await getUsers();
  const currentUser = readConfig().currentUserName;
  for (let user of users) {
    if (user.name === currentUser) {
      console.log(`* ${user.name} (current)`)
    } else {
      console.log(`* ${user.name}`)
    }
  }
}