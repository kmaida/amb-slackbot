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
exports.wpAddProfile = exports.wpGetProfile = exports.wpGetProfiles = exports.atGetProfile = exports.atAddProfile = exports.saveProfile = exports.getProfile = void 0;
const axios_1 = __importDefault(require("axios"));
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
     API UTILS
------------------*/
/**
 * Get full user profile (combined from both data sources)
 * @param {string} slackID Slack ID of user to fetch their combined data profile
 * @return {IProfile}
 */
const getProfile = (slackID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const atProfile = yield atGetProfile(slackID);
        const wpProfile = yield wpGetProfile(slackID);
        if (atProfile && wpProfile.acf) {
            const profile = {
                id: atProfile.id,
                wpid: wpProfile.id,
                name: wpProfile.acf.profile_name,
                email: atProfile.email,
                bio: wpProfile.acf.profile_bio,
                location: atProfile.location,
                website: wpProfile.acf.profile_website,
                twitter: wpProfile.acf.profile_twitter,
                github: wpProfile.acf.profile_github,
                airport: atProfile.airport,
                airline: atProfile.airline,
                ff: atProfile.ff
            };
            console.log('AT+WP: Full User Profile', profile);
            return profile;
        }
        return undefined;
    }
    catch (err) {
        errors_1.logErr(err);
    }
});
exports.getProfile = getProfile;
/**
 * Save profile data to multiple data sources and return accumulated saved data
 * @param {IObjectAny} app Slack App
 * @param {IProfile} data Profile data from modal form
 * @return {Promise<IProfile>} successfully saved WP and AT data
 */
const saveProfile = (app, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const saveWP = yield wpAddProfile(data);
        const saveAT = yield atAddProfile(data);
        const normalizedWP = {
            wpid: saveWP.id,
            image: saveWP.acf.profile_image,
            website: saveWP.acf.profile_website,
            twitter: saveWP.acf.profile_twitter,
            github: saveWP.acf.profile_github
        };
        const savedProfile = Object.assign(normalizedWP, saveAT);
        // Send Slack DM to submitter confirming successful save
        // dmConfirmSave(app, savedObj);
        // Send Slack channel message to private admin-only channel
        // adminChannelPublishSave(app, savedObj);
        return savedProfile;
    }
    catch (err) {
        errors_1.logErr(err);
    }
});
exports.saveProfile = saveProfile;
/*------------------
    AIRTABLE API
------------------*/
/**
 * Format Airtable profile record data into Slack app readable data
 * @param {IObjectAny} record Airtable profile record
 * @return {IATProfile}
 */
const _formatATRecord = (record) => {
    const id = record.getId();
    const recordObj = {
        id: id,
        name: record.fields["Name"],
        email: record.fields["Email"],
        location: record.fields["Location"],
        bio: record.fields["Bio"],
        airport: record.fields["Airport Code"],
        airline: record.fields["Preferred Airline"],
        ff: record.fields["Frequent Flyer Account"],
        passID: record.fields["Global Entry"],
        slackID: record.fields["Slack ID"],
        atLink: utils_1.getATLink(tableID, viewID, id)
    };
    // Return known record data to prefill form
    return recordObj;
};
/**
 * Get user's AT profile data by Slack ID
 * @param {string} slackID Slack ID of user to retrieve profile for
 * @return {Promise<IATProfile>}
 */
const atGetProfile = (slackID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getProfile = yield base(table).select({
            filterByFormula: `{Slack ID} = "${slackID}"`,
            view: viewID
        }).all();
        const atProfile = getProfile && getProfile.length ? _formatATRecord(getProfile[0]) : undefined;
        console.log('AIRTABLE: User Profile', atProfile);
        return atProfile;
    }
    catch (err) {
        errors_1.logErr(err);
    }
});
exports.atGetProfile = atGetProfile;
/**
 * Save a new Airtable ambassador profile data record
 * @param {IProfile} data to save to Airtable
 * @return {Promise<IATData>} promise resolving with saved object
 */
const atAddProfile = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const atFields = {
        "Name": data.name,
        "Email": data.email,
        "Location": data.location,
        "Bio": data.bio,
        "Airport Code": data.airport,
        "Preferred Airline": data.airline,
        "Frequent Flyer Account": data.ff,
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
        const savedObj = _formatATRecord(savedRecord);
        console.log('AIRTABLE: Saved new profile', savedObj);
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
 * Get a specific user's profile from WordPress
 * @param {string} slackID Slack ID of user to get profile for
 * @return {Promise<IATProfile>}
 */
const wpGetProfile = (slackID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield axios_1.default.get(`${process.env.WP_URL}/wp-json/acf/v3/profiles?filter[meta_key]=slack_id&filter[meta_value]=${slackID}`);
        const wpProfile = res.data && res.data.length ? res.data[0] : undefined;
        console.log('WPAPI: User Profile', wpProfile);
        return wpProfile;
    }
    catch (err) {
        errors_1.logErr(err);
    }
});
exports.wpGetProfile = wpGetProfile;
/**
 * Add Profile from WordPress API
 * Relies on ACF to REST API plugin to work
 * @param {IProfile} data profile data to add
 * @return {Promise<IACFProfile>}
 */
const wpAddProfile = (data) => __awaiter(void 0, void 0, void 0, function* () {
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