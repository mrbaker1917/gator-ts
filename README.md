# gator-ts

## gator is an RSSFeed agregator:

To run gator on your local machine, you will need to first clone the repo.
Then, you need to run `npm update`, `npm install`

Then, you need to run commands to retrieve RSSfeeds:

 - `npm run start login`
 - `npm run start register`
 - `npm run start users`
 - `npm run start addfeed <feed_name> <feed_url>` - to add a new feed
 - `npm run start feeds`
 - `npm run start follow` - to follow a new feed
 - `npm run start following` - to see which feeds you are following
 - `npm run start unfollow <feed_url>` - to unfollow a feed
 - `npm run start agg` - to fetch new content from feeds
 - `npm run start browse <limit>` - to browse your feeds
