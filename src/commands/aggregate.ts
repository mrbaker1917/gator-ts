import { fetchFeed } from "../lib/rss.js";
import { markFeedFetched, getNextFeedToFetch } from "src/lib/db/queries/feeds.js";

export async function handlerAgg(time_between_reqs: string) {
    const feedURL = "https://www.wagslane.dev/index.xml";
    const feedData = await fetchFeed(feedURL);
    const feedDataStr = JSON.stringify(feedData);
    console.log(feedDataStr);
}

async function scrapeFeeds() {
    const nextFeed = await getNextFeedToFetch();
    if (!nextFeed) {
        console.log("No feeds to fetch.");
        return;
    }
    const feedData = await fetchFeed(nextFeed.url);
    const fetchedFeed = await markFeedFetched(nextFeed.id);
    for (let item of feedData.channel.item) {
        console.log(item.title);
    }
}