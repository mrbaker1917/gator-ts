import { XMLParser } from "fast-xml-parser";

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export async function fetchFeed(feedUrl: string): Promise<RSSFeed> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
        'User-Agent': 'gator',
        accept: "application/rss+xml"
    }
  };

    const response = await fetch(feedUrl, requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const resp_text = await response.text()
    const xmlParser = new XMLParser({processEntities: false});
    const resp_json = xmlParser.parse(resp_text);
    
    if (!resp_json.rss?.channel) {
        throw new Error("no channel in feed!")
    }
    const channel = resp_json.rss.channel;
    if (!channel.title || !channel.link || !channel.description) {
        throw new Error("response does not contain title, link, or description!")
    }

    let items = [];

    if (!channel.item) {
        items = [];
    } else if (Array.isArray(channel.item)) {
        items = channel.item;
    } else {
        items = [channel.item]
    }
    
    const rssItems: RSSItem[] = [];
    for (let i of items) {
      if (!i.title || !i.link || !i.description || !i.pubDate) {
        continue
      } else {
      rssItems.push({
        title: i.title,
        link: i.link,
        description: i.description,
        pubDate: i.pubDate,
      })
    }}


    return {
      channel: {
        title: channel.title,
        link: channel.link,
        description: channel.description,
        item: rssItems,
      }
  }
}