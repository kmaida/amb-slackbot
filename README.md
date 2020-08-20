# amb-slackbot

Slackbot for community ambassadors to manage their activities, reimbursement, swag requests, etc.

## Technology

* [Airtable](https://airtable.com/) (metrics tracking, travel requests, etc.)
* [WordPress](#wordpress) (public activities, profiles, etc.)
* [WPAPI](https://www.npmjs.com/package/wpapi) (WordPress REST API)
* [MongoDB Atlas](https://account.mongodb.com/account) (Slackbot administration settings)
* _[GraphQL](https://graphql.org/graphql-js/) (TBD)_
* [TypeScript](https://www.typescriptlang.org/)
* [Bolt Slack JS framework](https://github.com/slackapi/bolt-js) (Node)
* [ngrok](https://ngrok.com/) (development tunnel for Slack)

### WordPress

* [MAMP Pro](https://www.mamp.info/) (for local development)
* [Advanced Custom Fields (Pro)](https://www.advancedcustomfields.com/)
* [ACF to REST API](http://github.com/airesvsg/acf-to-rest-api) (support ACF post / put in REST API)
* [JSON Basic Authentication](https://github.com/WP-API/Basic-Auth) (need to install manually; supports WPAPI for REST API)

## Changelog / Notes

* 2020-06-30: Deleted custom post type plugin and replaced with https://gist.github.com/kmaida/ed218a2c54f3d4f5012d8962a4275f9c
* 2020-06-27: Added https://github.com/WP-API/Basic-Auth for `node-wpapi` auth
* 2020-06-27: Modified `MAMP/htdocs/wp-gatsby-amb/wp-includes/functions.php` to add lines `10`-`34` registering REST field for ACF
