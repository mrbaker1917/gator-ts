import { readConfig } from "src/config";
import { createFeedFollow, getFeedFollowsForUser } from "src/lib/db/queries/feed_follows";
import { getUserByName } from "src/lib/db/queries/users";
import { getFeedByUrl } from "src/lib/db/queries/feeds";

export async function follow(cmdName: string, ...args: string[]) {
    if (args.length != 1) {
        throw new Error(`usage: ${cmdName} <url>`);
    }
    const url = args[0];
    const cfg = readConfig();
    const user = await getUserByName(cfg.currentUserName);
    if (!user) {
        throw new Error("No user found!");
    }
    const feed = await getFeedByUrl(url);
    if (!feed) {
        throw new Error("No feed found!");
    }
    const newfeed = await createFeedFollow(user.id, feed.id);
    console.log(newfeed.userName);
    console.log(newfeed.feedName);
}

export async function following(cmdName: string, ...args: string[]) {
    if (args.length != 0) {
        throw new Error(`usage: ${cmdName}`)
    }
    const cfg = readConfig();
    const user = await getUserByName(cfg.currentUserName);
    const follows = await getFeedFollowsForUser(user.id);
    for (let f of follows) {
        console.log(f.feedName);
    }
}