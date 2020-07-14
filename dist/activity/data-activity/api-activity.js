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
/*------------------
    AIRTABLE API
------------------*/
/**
 * Save a new Airtable data record
 * @param {IObjectAny} App Slack app
 * @param {IActivity} data to save to Airtable
 * @return {Promise<IATData>} promise resolving with saved object
 */
const atAddActivity = (app, data) => __awaiter(void 0, void 0, void 0, function* () {
    return base(table).create([
        {
            "fields": {
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
            }
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
            atLink: `https://airtable.com/${tableID}/${viewID}/${savedID}`
        };
        console.log('AIRTABLE: Saved new activity', savedObj);
        // Send Slack DM to submitter confirming successful save
        dm_confirm_save_activity_1.dmConfirmSave(app, savedObj);
        // Send Slack channel message to private admin-only channel
        admin_channel_publish_save_activity_1.adminChannelPublishSave(app, savedObj);
        // @NOTE: If you want to update home view: need to have passed user's app home view ID
        return savedObj;
    });
});
exports.atAddActivity = atAddActivity;
/*------------------
   WORDPRESS API
------------------*/
/**
 * Get Activities from ACF API (custom post type consisting of only ACF fields)
 * @returns {IACFActivity[]} array of activity objects from WP
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
 * @param {IWPActivity} data activity data to add
 * @returns {Promise<IACFActivity>}
 */
const wpAddActivity = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addWpActivity = yield setup_wpapi_1.wpApi.activities().create({
            title: data.activity_title,
            content: '',
            fields: data,
            status: 'publish'
        });
        const acfActivity = {
            id: addWpActivity.id,
            acf: addWpActivity.acf
        };
        console.log('WPAPI: Successfully saved activity', acfActivity);
        return acfActivity;
    }
    catch (err) {
        console.error(err);
    }
});
exports.wpAddActivity = wpAddActivity;
//# sourceMappingURL=api-activity.js.map