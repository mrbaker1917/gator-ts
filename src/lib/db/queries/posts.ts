import { db } from "..";
import { feed_follows, feeds, posts } from "../schema";
import { eq, desc } from "drizzle-orm";

export async function createPost(feedId: string, title: string, url: string, description: string, publishedAt?: Date | null) {
  const [result] = await db.insert(posts)
  .values({ feedId: feedId, title: title, url: url, description: description, publishedAt: publishedAt})
  .returning();
  return result;
}

export async function getPostsForUsers(userId: string, limit: number) {
    const post_list = await db.select({
        id: posts.id,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        title: posts.title,
        url: posts.url, 
        description: posts.description,
        publishedAt: posts.publishedAt,
        feedName: feeds.name,

    }).from(posts)
    .innerJoin(feed_follows, eq(posts.feedId, feed_follows.feedId))
    .innerJoin(feeds, eq(feed_follows.feedId, feeds.id))
    .where(eq(feed_follows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
    return post_list;
} 