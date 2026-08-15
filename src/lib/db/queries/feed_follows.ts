import { db } from "..";
import { feed_follows, feeds, users } from "../schema";
import { eq } from "drizzle-orm";

export async function createFeedFollow(userId: string, feedId: string) {
    const [newFeedFollow] = await db.insert(feed_follows).values({ userId, feedId }).returning();
    const [feed_follow_join] = await db.select({
        id: feed_follows.id,
        createdAt: feed_follows.createdAt,
        updatedAt: feed_follows.updatedAt,
        userId: feed_follows.userId,
        feedId: feed_follows.feedId,
        feedName: feeds.name,
        userName: users.name
    }).from(feed_follows)
        .innerJoin(feeds, eq(feed_follows.feedId, feeds.id))
        .innerJoin(users, eq(feed_follows.userId, users.id))
        .where(eq(feed_follows.id, newFeedFollow.id));
    return feed_follow_join
};

export async function getFeedFollowsForUser(userId: string) {
    const userFollows = await db.select({
        id: feed_follows.id,
        createdAt: feed_follows.createdAt,
        updatedAt: feed_follows.updatedAt,
        userId: feed_follows.userId,
        feedId: feed_follows.feedId,
        userName: users.name,
        feedName: feeds.name,
    }).from(feed_follows)
        .innerJoin(feeds, eq(feed_follows.feedId, feeds.id))
        .innerJoin(users, eq(feed_follows.userId, users.id))
        .where(eq(feed_follows.userId, userId));
    return userFollows;
};

