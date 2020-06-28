# gatsbam-slackbot

Slackbot for Gatsby community ambassadors to manage their activities, reimbursement, swag requests, etc.

## Technology

* Airtable (metrics tracking, travel requests, etc.)
* [WordPress](#wordpress)
* WPAPI (public activities, profiles, etc.)
* MongoDB (Slackbot administration)
* GraphQL
* TypeScript
* Bolt Slack JS framework (Node)

### WordPress

* [Advanced Custom Fields](https://www.advancedcustomfields.com/)
* [ACF to REST API](http://github.com/airesvsg/acf-to-rest-api)
* [Custom Post Type UI](https://wordpress.org/plugins/custom-post-type-ui/) (to create custom post types, not custom fields; use ACF for custom fields)
* [JSON Basic Authentication](https://github.com/WP-API/Basic-Auth) (need to install manually)

## Changelog / Notes

* 2020-06-27: Added https://github.com/WP-API/Basic-Auth for `node-wpapi` auth
* 2020-06-27: Modified `MAMP/htdocs/wp-gatsby-amb/wp-includes/functions.php` to add lines `10`-`34` registering REST field for ACF