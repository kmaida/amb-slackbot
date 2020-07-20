import * as dotenv from "dotenv";
dotenv.config();
import { App } from '@slack/bolt';
// MongoDB (app admin settings)
import { mdbSetup } from './data/setup-mongodb';
import { initAdminSettings } from './app-home/admin/api-admin';
// WordPress REST API
import { wpApiSetup } from './data/setup-wpapi';
// App functionality
import { modalActivity } from './activity/modal-activity';
import { submitModalActivity } from './activity/modal-view-submit-activity';
import { appHomeOpened } from './app-home/event-app-home-opened';
import { appMention } from './app-mention/event-app-mention';
import { botDM } from './message-im/event-message-im';
import { scheduleATSyncs } from './utils/jobs';
import { modalProfile } from "./profile/modal-profile";
import { submitModalProfile } from "./profile/modal-view-submit-profile";

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
// Schedule Airtable sync job
scheduleATSyncs(app);

/*------------------
    PROFILE IX
------------------*/
modalProfile(app);
submitModalProfile(app);

/*------------------
    ACTIVITY IX
------------------*/
modalActivity(app);
submitModalActivity(app);

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
