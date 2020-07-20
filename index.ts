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
// REMOVE AFTER TESTING
import { wpGetProfiles, wpAddProfile, atAddProfile } from './profile/data-profile/api-profile';
wpGetProfiles();
// wpAddProfile(app, {
//   name: 'Kim Maida',
//   email: 'kim@gatsbyjs.com',
//   bio: 'Head of DevRel & Community at Gatsby',
//   location: 'Michigan',
//   twitter: 'KimMaida',
//   slackID: 'U01238R77J6'
// });
atAddProfile(app, {
  name: 'Kim',
  email: 'kim@gatsbyjs.com',
  bio: 'Hi there my bio',
  location: 'Michigan',
  airport: 'DTW',
  airline: 'Delta',
  ff: '123',
  passID: '12345',
  slackID: 'U01238R77J6'
});

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
