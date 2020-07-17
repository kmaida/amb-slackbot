"use strict";
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
exports.wpAddActivity = exports.wpGetActivities = exports.atAddActivity = void 0;
const errors_1 = require("../../utils/errors");
const dm_confirm_save_activity_1 = require("./dm-confirm-save-activity");
const admin_channel_publish_save_activity_1 = require("./admin-channel-publish-save-activity");
// Airtable
const base = require('airtable').base(process.env.AIRTABLE_BASE_ID);
const table = process.env.AT_TABLE_ACTIVITY;
const tableID = process.env.AT_TABLE_ID_ACTIVITY;
const viewID = process.env.AT_TABLE_VIEW_ID_ACTIVITY;
const utils_1 = require("./../../utils/utils");
// WordPress API
const setup_wpapi_1 = require("./../../data/setup-wpapi");
const channel_publish_save_1 = require("./channel-publish-save");
/*------------------
    AIRTABLE API
------------------*/
/**
 * Save a new Airtable data record
 * @param {IObjectAny} app Slack app
 * @param {IActivity} data to save to Airtable
 * @return {Promise<IATData>} promise resolving with saved object
 */
const atAddActivity = (app, data) => __awaiter(void 0, void 0, void 0, function* () {
    const atFields = {
        "Name": data.name,
        "Email": data.email,
        "Activity Type": data.type,
        "Title": data.title,
        "Date": data.date,
        "URL": data.url,
        "Topic": data.topic,
        "Reach": data.reach,
        "Quarter": utils_1.getQ(data.date),
        "Slack ID": data.slackID
    };
    return base(table).create([
        {
            "fields": atFields
        }
    ], (err, records) => {
        if (err) {
            errors_1.storeErr(err);
        }
        const savedRecord = records[0];
        const savedID = savedRecord.getId();
        const savedObj = {
            id: savedID,
            name: savedRecord.fields["Name"],
            email: savedRecord.fields["Email"],
            type: savedRecord.fields["Activity Type"],
            url: savedRecord.fields["URL"],
            date: savedRecord.fields["Date"],
            title: savedRecord.fields["Title"],
            topic: savedRecord.fields["Topic"],
            reach: savedRecord.fields["Reach"],
            quarter: savedRecord.fields["Quarter"],
            slackID: savedRecord.fields["Slack ID"],
            atLink: utils_1.getATLink(tableID, viewID, savedID)
        };
        console.log('AIRTABLE: Saved new activity', savedObj);
        // Send Slack DM to submitter confirming successful save
        dm_confirm_save_activity_1.dmConfirmSave(app, savedObj);
        // Send Slack channel message to private admin-only channel
        admin_channel_publish_save_activity_1.adminChannelPublishSave(app, savedObj);
        return savedObj;
    });
});
exports.atAddActivity = atAddActivity;
/*------------------
   WORDPRESS API
------------------*/
/**
 * Get Activities from ACF API (custom post type consisting of only ACF fields)
 * @return {IACFActivity[]} array of activity objects from WP
 */
const wpGetActivities = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getActivities = yield setup_wpapi_1.wpApi.activities();
        const activities = [];
        getActivities.forEach((activity) => {
            const acf = activity.acf;
            const obj = {
                id: activity.id,
                acf: acf
            };
            activities.push(obj);
        });
        console.log('WPAPI: Activities', activities);
        return activities;
    }
    catch (err) {
        console.error(err);
    }
});
exports.wpGetActivities = wpGetActivities;
/**
 * Add Activity from WordPress API
 * Relies on ACF to REST API plugin to work
 * This will only happen if user opts into public publishing
 * @param {IObjectAny} app Slack app
 * @param {IActivity} data activity data to add
 * @return {Promise<IACFActivity>}
 */
const wpAddActivity = (app, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wpFields = {
            activity_name: data.name,
            activity_type: data.type,
            activity_title: data.title,
            activity_date: data.date,
            activity_url: data.url,
            activity_topic: data.topic,
            slack_id: data.slackID
        };
        const addWpActivity = yield setup_wpapi_1.wpApi.activities().create({
            title: data.title,
            content: '',
            fields: wpFields,
            status: 'publish'
        });
        const acfActivity = {
            id: addWpActivity.id,
            acf: addWpActivity.acf
        };
        console.log('WPAPI: Saved new activity', acfActivity);
        // Publish activity to public Slack channel
        channel_publish_save_1.channelPublishSave(app, acfActivity.acf);
        return acfActivity;
    }
    catch (err) {
        console.error(err);
    }
});
exports.wpAddActivity = wpAddActivity;
//# sourceMappingURL=api-activity.js.map