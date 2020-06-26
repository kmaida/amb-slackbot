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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveData = void 0;
const base = require('airtable').base(process.env.AIRTABLE_BASE_ID);
const table = process.env.AT_TABLE_ACTIVITY;
const tableID = process.env.AIRTABLE_TABLE_ID;
const viewID = process.env.AIRTABLE_TABLE_VIEW_ID;
const errors_1 = require("../../utils/errors");
const dm_confirm_save_activity_1 = __importDefault(require("./dm-confirm-save-activity"));
const admin_channel_publish_save_activity_1 = __importDefault(require("./admin-channel-publish-save-activity"));
/*------------------
  AIRTABLE: TABLE
------------------*/
/**
 * Save a new Airtable data record
 * @param {IObjectAny} App Slack app
 * @param {IActivity} data to save to Airtable
 * @return {Promise<IATData>} promise resolving with saved object
 */
const saveData = (app, data) => __awaiter(void 0, void 0, void 0, function* () {
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
            slackID: savedRecord.fields["Slack ID"],
            atLink: `https://airtable.com/${tableID}/${viewID}/${savedID}`
        };
        console.log('AIRTABLE: Saved new activity', savedObj);
        // Send Slack DM to submitter confirming successful save
        dm_confirm_save_activity_1.default(app, savedObj);
        // Send Slack channel message to private admin-only channel
        admin_channel_publish_save_activity_1.default(app, savedObj);
        // @NOTE: If you want to update home view: need to have passed user's app home view ID
        return savedObj;
    });
});
exports.saveData = saveData;
//# sourceMappingURL=api-activity.js.map