import { IObjectAny } from '../../utils/types';
import { IProfile, IATProfile, IWPProfile, IACFProfile } from './../profile.interface';
import { storeErr, logErr } from '../../utils/errors';
// Airtable
const base = require('airtable').base(process.env.AIRTABLE_BASE_ID);
const table = process.env.AT_TABLE_PROFILES;
const tableID = process.env.AT_TABLE_ID_PROFILES;
const viewID = process.env.AT_TABLE_VIEW_ID_PROFILES;
import { getATLink } from './../../utils/utils';
// WordPress API
import { wpApi } from './../../data/setup-wpapi';
import axios from 'axios';

/*------------------
    AIRTABLE API
------------------*/

/**
 * Format Airtable profile record data into Slack app readable data
 * @param {IObjectAny} record Airtable profile record
 * @return {IATProfile}
 */
const _formatATRecord = (record: IObjectAny): IATProfile => {
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
    atLink: getATLink(tableID, viewID, id)
  };
  // Return known record data to prefill form
  return recordObj;
}

/**
 * Get user's AT profile data by Slack ID
 * @param {string} slackID Slack ID of user to retrieve profile for
 * @return {Promise<IATProfile>}
 */
const atGetProfile = async (slackID: string): Promise<IATProfile> => {
  try {
    const getProfile = await base(table).select({
      filterByFormula: `{Slack ID} = "${slackID}"`,
      view: viewID
    }).all();
    const atProfile = getProfile && getProfile.length ? _formatATRecord(getProfile[0]) : undefined;
    console.log('AIRTABLE: User Profile', atProfile);
    return atProfile;
  }
  catch (err) {
    logErr(err);
  }
};

/**
 * Save a new Airtable ambassador profile data record
 * @param {IObjectAny} app Slack app
 * @param {IProfile} data to save to Airtable
 * @return {Promise<IATData>} promise resolving with saved object
 */
const atAddProfile = async (app: IObjectAny, data: IProfile): Promise<IATProfile> => {
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
  ], (err: string, records: IObjectAny) => {
    if (err) {
      storeErr(err);
    }
    const savedRecord: IObjectAny = records[0];
    const savedObj: IATProfile = _formatATRecord(savedRecord);
    console.log('AIRTABLE: Saved new profile', savedObj);
    // Send Slack DM to submitter confirming successful save
    // dmConfirmSave(app, savedObj);
    // Send Slack channel message to private admin-only channel
    // adminChannelPublishSave(app, savedObj);
    return savedObj;
  });
};

/*------------------
   WORDPRESS API
------------------*/

/**
 * Get profiles from ACF API (custom post type consisting of only ACF fields)
 * @return {IACFProfile[]} array of profile objects from WP
 */
const wpGetProfiles = async (): Promise<IACFProfile[]> => {
  try {
    const getProfiles: IObjectAny[] = await wpApi.profiles();
    const profiles: IACFProfile[] = [];
    getProfiles.forEach((profile: IObjectAny) => {
      const acf: IWPProfile = profile.acf;
      const obj: IACFProfile = {
        id: profile.id,
        acf: acf
      }
      profiles.push(obj);
    });
    console.log('WPAPI: Profiles', profiles);
    return profiles;
  }
  catch (err) {
    console.error(err);
  }
};

/**
 * Get a specific user's profile from WordPress
 * @param {string} slackID Slack ID of user to get profile for
 * @return {Promise<IATProfile>}
 */
const wpGetProfile = async (slackID: string): Promise<IACFProfile> => {
  try {
    const res = await axios.get(`${process.env.WP_URL}/wp-json/acf/v3/profiles?filter[meta_key]=slack_id&filter[meta_value]=${slackID}`);
    const wpProfile: IACFProfile = res.data && res.data.length ? res.data[0] : undefined;
    console.log('WPAPI: User Profile', wpProfile);
    return wpProfile;
  }
  catch (err) {
    logErr(err);
  }
};

/**
 * Add Profile from WordPress API
 * Relies on ACF to REST API plugin to work
 * @param {IObjectAny} app Slack app
 * @param {IProfile} data profile data to add
 * @return {Promise<IACFProfile>}
 */
const wpAddProfile = async (app: IObjectAny, data: IProfile): Promise<IACFProfile> => {
  try {
    const wpFields: IWPProfile = {
      profile_name: data.name,
      profile_bio: data.bio,
      profile_location: data.location,
      profile_website: data.website,
      profile_twitter: data.twitter,
      profile_github: data.github,
      profile_image: data.image,
      slack_id: data.slackID
    };
    const addWpProfile = await wpApi.profiles().create({
      title: data.name,
      content: '',
      fields: wpFields,
      status: 'publish'
    });
    const acfProfile: IACFProfile = {
      id: addWpProfile.id,
      acf: addWpProfile.acf
    };
    console.log('WPAPI: Saved new profile', acfProfile);
    return acfProfile;
  }
  catch (err) {
    console.error(err);
  }
};

export { atAddProfile, atGetProfile, wpGetProfiles, wpGetProfile, wpAddProfile };