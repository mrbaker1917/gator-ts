import { fetchFeed } from "../lib/rss.js";
import { markFeedFetched, getNextFeedToFetch } from "src/lib/db/queries/feeds.js";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <time_between_reqs>`);
    }
    const timeArg = args[0];
    const timeBetweenRequests = parseDuration(timeArg);
    if (!timeBetweenRequests) {
        throw new Error(`invalid duration: ${timeArg} - use format 1h 30m 15s or 3500ms`)
    }
    console.log(`Starting feed scraping every ${timeBetweenRequests} milliseconds...`);
    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeBetweenRequests);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
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

function handleError(err: unknown) {
    console.error(`Error scraping feeds: ${err instanceof Error ? err.message : err}`);
}