"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const bolt_1 = require("@slack/bolt");
// MongoDB (app admin settings)
const setup_mongodb_1 = require("./data/setup-mongodb");
const api_admin_1 = require("./app-home/admin/api-admin");
// WordPress REST API
const setup_wpapi_1 = require("./data/setup-wpapi");
const api_activity_1 = require("./activity/data-activity/api-activity"); // @TODO: remove after testing
// App functionality
const modal_activity_1 = require("./activity/modal-activity");
const modal_view_submit_activity_1 = require("./activity/modal-view-submit-activity");
const event_app_home_opened_1 = require("./app-home/event-app-home-opened");
const event_app_mention_1 = require("./app-mention/event-app-mention");
const event_message_im_1 = require("./message-im/event-message-im");
const jobs_1 = require("./utils/jobs");
/*------------------
  CREATE BOLT APP
------------------*/
const app = new bolt_1.App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});
const port = process.env.PORT || 3000;
/*------------------
    ON APP INIT
------------------*/
// Set up MongoDB store
setup_mongodb_1.mdbSetup();
// Set up admin settings from environment variables
api_admin_1.initAdminSettings();
// Set up WordPress API
setup_wpapi_1.wpApiSetup();
// Schedule Airtable sync job
jobs_1.scheduleATSyncs(app);
/**
 * REMOVE ALL BELOW AFTER TESTING
 */
// Get Activities that have been saved to WordPress
api_activity_1.wpGetActivities();
// Test creation of activity from API
// wpAddActivity({
//   activity_name: 'Test 2',
//   activity_type: 'Speaking',
//   activity_title: 'Test API',
//   activity_url: 'http://wp-api.org/node-wpapi/using-the-client/#creating-posts',
//   activity_date: '2020-06-28',
//   activity_topic: 'Creating an activity from REST API',
//   slack_id: 'U01238R77J6'
// });
// Test creation of activity in Airtable
// atAddActivity(app, {
//   name: 'Kim Maida',
//   email: 'kim@gatsbyjs.com',
//   type: 'Podcast',
//   title: 'The Pod People',
//   date: '2020-06-30',
//   url: 'https://google.com',
//   topic: 'Testing AT insertion',
//   reach: 500,
//   slackID: 'U01238R77J6'
// });
/*------------------
  SET UP MODAL IX
------------------*/
modal_activity_1.modalActivity(app);
modal_view_submit_activity_1.submitModalActivity(app);
/*------------------
  APP HOME OPENED
------------------*/
event_app_home_opened_1.appHomeOpened(app);
/*------------------
    APP MENTION
------------------*/
event_app_mention_1.appMention(app);
/*------------------
       BOT DM
------------------*/
event_message_im_1.botDM(app);
/*------------------
     START APP
------------------*/
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield app.start(port);
    console.log(`⚡️ Gatsbam slackbot is running on ${port}!`);
}))();
//# sourceMappingURL=index.js.map