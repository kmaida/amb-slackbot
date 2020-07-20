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
exports.wpAddProfile = exports.wpGetProfiles = exports.atAddProfile = void 0;
const errors_1 = require("../../utils/errors");
// Airtable
const base = require('airtable').base(process.env.AIRTABLE_BASE_ID);
const table = process.env.AT_TABLE_PROFILES;
const tableID = process.env.AT_TABLE_ID_PROFILES;
const viewID = process.env.AT_TABLE_VIEW_ID_PROFILES;
const utils_1 = require("./../../utils/utils");
// WordPress API
const setup_wpapi_1 = require("./../../data/setup-wpapi");
/*------------------
    AIRTABLE API
------------------*/
/**
 * Save a new Airtable ambassador profile data record
 * @param {IObjectAny} app Slack app
 * @param {IProfile} data to save to Airtable
 * @return {Promise<IATData>} promise resolving with saved object
 */
const atAddProfile = (app, data) => __awaiter(void 0, void 0, void 0, function* () {
    const atFields = {
        "Name": data.name,
        "Email": data.email,
        "Location": data.location,
        "Bio": data.bio,
        "Airport Code": data.airport,
        "Preferred Airline": data.airline,
        "Frequent Flyer Account": data.ff,
        "Global Entry": data.passID,
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
            location: savedRecord.fields["Location"],
            bio: savedRecord.fields["Bio"],
            airport: savedRecord.fields["Airport Code"],
            airline: savedRecord.fields["Preferred Airline"],
            ff: savedRecord.fields["Frequent Flyer Account"],
            passID: savedRecord.fields["Global Entry"],
            slackID: savedRecord.fields["Slack ID"],
            atLink: utils_1.getATLink(tableID, viewID, savedID)
        };
        console.log('AIRTABLE: Saved new profile', savedObj);
        // Send Slack DM to submitter confirming successful save
        // dmConfirmSave(app, savedObj);
        // Send Slack channel message to private admin-only channel
        // adminChannelPublishSave(app, savedObj);
        return savedObj;
    });
});
exports.atAddProfile = atAddProfile;
/*------------------
   WORDPRESS API
------------------*/
/**
 * Get profiles from ACF API (custom post type consisting of only ACF fields)
 * @return {IACFProfile[]} array of profile objects from WP
 */
const wpGetProfiles = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getProfiles = yield setup_wpapi_1.wpApi.profiles();
        const profiles = [];
        getProfiles.forEach((profile) => {
            const acf = profile.acf;
            const obj = {
                id: profile.id,
                acf: acf
            };
            profiles.push(obj);
        });
        console.log('WPAPI: Profiles', profiles);
        return profiles;
    }
    catch (err) {
        console.error(err);
    }
});
exports.wpGetProfiles = wpGetProfiles;
/**
 * Add Profile from WordPress API
 * Relies on ACF to REST API plugin to work
 * @param {IObjectAny} app Slack app
 * @param {IProfile} data profile data to add
 * @return {Promise<IACFProfile>}
 */
const wpAddProfile = (app, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wpFields = {
            profile_name: data.name,
            profile_bio: data.bio,
            profile_location: data.location,
            profile_website: data.website,
            profile_twitter: data.twitter,
            profile_github: data.github,
            profile_image: data.image,
            slack_id: data.slackID
        };
        const addWpProfile = yield setup_wpapi_1.wpApi.profiles().create({
            title: data.name,
            content: '',
            fields: wpFields,
            status: 'publish'
        });
        const acfProfile = {
            id: addWpProfile.id,
            acf: addWpProfile.acf
        };
        console.log('WPAPI: Saved new profile', acfProfile);
        return acfProfile;
    }
    catch (err) {
        console.error(err);
    }
});
exports.wpAddProfile = wpAddProfile;
//# sourceMappingURL=api-profile.js.map