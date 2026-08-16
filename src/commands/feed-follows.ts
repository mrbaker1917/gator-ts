import { createFeedFollow, getFeedFollowsForUser } from "src/lib/db/queries/feed_follows";
import { getFeedByUrl } from "src/lib/db/queries/feeds";
import { User } from "src/lib/db/schema"

export async function follow(cmdName: string, user: User, ...args: string[]) {
    if (args.length != 1) {
        throw new Error(`usage: ${cmdName} <url>`);
    }
    const url = args[0];
    const feed = await getFeedByUrl(url);
    if (!feed) {
        throw new Error("No feed found!");
    }
    const newfeed = await createFeedFollow(user.id, feed.id);
    console.log(newfeed.userName);
    console.log(newfeed.feedName);
}

export async function following(cmdName: string, user: User, ...args: string[]) {
    if (args.length != 0) {
        throw new Error(`usage: ${cmdName}`)
    }

    const follows = await getFeedFollowsForUser(user.id);
    for (let f of follows) {
        console.log(f.feedName);
    }
}