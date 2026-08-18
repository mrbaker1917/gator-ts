import { fetchFeed } from "../lib/rss.js";
import { markFeedFetched, getNextFeedToFetch } from "src/lib/db/queries/feeds.js";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    if (args.length < 1) {
        console.log("usage: cli agg <time_between_reqs>");
        process.exit(1);
    }
    const time_between_reqs = args[0];
    const interval = parseDuration(time_between_reqs);
    console.log(`Starting feed scraping every ${interval} milliseconds...`);
    scrapeFeeds().catch((err) => {
        console.error(`Error scraping feeds: ${err}`);
        process.exit(1);
    });
    setInterval(() => {
        scrapeFeeds().catch((err) => {
            console.error(`Error scraping feeds: ${err}`);
            process.exit(1);
        });
    }, interval);  
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

function parseDuration(duration: string): number {
    const regex = /(\d+)([smhd])/g;
    let milliSeconds = 0;
    let match;

    while ((match = regex.exec(duration)) !== null) {
        const value = parseInt(match[1], 10);
        const unit = match[2];

        switch (unit) {
            case 's':
                milliSeconds += value * 1000;
            case 'm':
                milliSeconds += value * 60 * 1000;
            case 'h':
                milliSeconds += value * 60 * 60 * 1000;
            case 'd':
                milliSeconds += value * 24 * 60 * 60 * 1000;
        }
    }
    return milliSeconds;
}