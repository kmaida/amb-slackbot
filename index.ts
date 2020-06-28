import * as dotenv from "dotenv";
dotenv.config();
import { App } from '@slack/bolt';
// MongoDB
import { mdbSetup } from './data/setup-mongodb';
import { initAdminSettings } from './app-home/admin/api-admin';
// WordPress API
import { wpApiSetup } from './data/setup-wpapi';
import { wpGetActivities } from './activity/data-activity/api-activity';  // @TODO: remove after testing
// App functionality
import modal from './activity/modal-activity';
import submitModal from './activity/modal-view-submit-activity';
import appHomeOpened from './app-home/event-app-home-opened';
import appMention from './app-mention/event-app-mention';
import botDM from './message-im/event-message-im';

/*------------------
  CREATE BOLT APP
------------------*/
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});
const port = process.env.PORT || 3000;

/*------------------
    ON APP INIT
------------------*/
// Set up MongoDB store
mdbSetup();
// Set up admin settings from environment variables
initAdminSettings();
// Set up WordPress API
wpApiSetup();

/**
 * REMOVE ALL BELOW AFTER TESTING
 */
// Get Activities that have been saved to WordPress
wpGetActivities();
// Test creation of activity from API
// wpAddActivity({
//   activity_name: 'Test REST API',
//   activity_type: 'Speaking',
//   activity_title: 'Development',
//   activity_link: 'http://wp-api.org/node-wpapi/using-the-client/#creating-posts',
//   activity_date: '2020-06-27',
//   activity_topic: 'Creating an activity from REST API'
// });

/*------------------
  SET UP MODAL IX
------------------*/
modal(app);
submitModal(app);

/*------------------
  APP HOME OPENED
------------------*/
appHomeOpened(app);

/*------------------
    APP MENTION
------------------*/
appMention(app);

/*------------------
       BOT DM
------------------*/
botDM(app);

/*------------------
     START APP
------------------*/
(async () => {
  await app.start(port);
  console.log(`⚡️ Gatsbam slackbot is running on ${port}!`);
})();
