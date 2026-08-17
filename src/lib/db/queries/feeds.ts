import { db } from "..";
import { feeds } from "../schema";
import { eq, sql } from "drizzle-orm";


export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db.insert(feeds).values({ name, url, userId }).returning();
  return result;
}

export async function getFeeds() {
  return await db.select().from(feeds);
}

export async function getFeedByUrl(url: string) {
    const [feed] = await db.select().from(feeds).where(eq(feeds.url, url));
    return feed;
}

export async function markFeedFetched(feedId: string) {
  const [result] = await db.update(feeds)
  .set({ lastFetchedAt: new Date(), updatedAt: new Date()})
  .where(eq(feeds.id, feedId)).returning();
  return result;
}

export async function getNextFeedToFetch() {
  const [result] = await db.select().from(feeds)
  .orderBy(sql `${feeds.lastFetchedAt} asc nulls first`)
  .limit(1);
  return result;
}