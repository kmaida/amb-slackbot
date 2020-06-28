# gatsbam-slackbot

Slackbot for Gatsby community ambassadors to manage their activities, reimbursement, swag requests, etc.

## Technology

* [Airtable](https://airtable.com/) (metrics tracking, travel requests, etc.)
* [WordPress](#wordpress) (public activities, profiles, etc.)
* [WPAPI](https://www.npmjs.com/package/wpapi) (WordPress REST API)
* [MongoDB Atlas](https://account.mongodb.com/account) (Slackbot administration settings)
* [GraphQL](https://graphql.org/graphql-js/)
* [TypeScript](https://www.typescriptlang.org/)
* [Bolt Slack JS framework](https://github.com/slackapi/bolt-js) (Node)
* [ngrok](https://ngrok.com/)

### WordPress

* [MAMP Pro](https://www.mamp.info/) (for local development)
* [Advanced Custom Fields](https://www.advancedcustomfields.com/)
* [ACF to REST API](http://github.com/airesvsg/acf-to-rest-api) (support )
* [Custom Post Type UI](https://wordpress.org/plugins/custom-post-type-ui/) (to create custom post types, not custom fields; use ACF for custom fields)
* [JSON Basic Authentication](https://github.com/WP-API/Basic-Auth) (need to install manually)

## Changelog / Notes

* 2020-06-27: Added https://github.com/WP-API/Basic-Auth for `node-wpapi` auth
* 2020-06-27: Modified `MAMP/htdocs/wp-gatsby-amb/wp-includes/functions.php` to add lines `10`-`34` registering REST field for ACF