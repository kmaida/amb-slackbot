import axios from 'axios';
import { IObjectAny } from '../../utils/types';
import { IProfile, IATProfile, IWPProfile, IACFProfile } from './../profile.interface';
import { storeErr, logErr, slackErr } from '../../utils/errors';
// Airtable
const base = require('airtable').base(process.env.AIRTABLE_BASE_ID);
const table = process.env.AT_TABLE_PROFILES;
const tableID = process.env.AT_TABLE_ID_PROFILES;
const viewID = process.env.AT_TABLE_VIEW_ID_PROFILES;
import { getAtLink } from './../../utils/utils';
// WordPress API
import { wpApi } from './../../data/setup-wpapi';
import { adminChannelProfileSave } from './admin-channel-publish-save-profile';
import { dmConfirmSaveProfile } from './dm-confirm-save-profile';

/*------------------
     API UTILS
------------------*/

/**
 * Get full user profile (combined from both data sources)
 * @param {string} slackID Slack ID of user to fetch their combined data profile
 * @return {IProfile}
 */
const getProfile = async (slackID: string): Promise<IProfile> => {
  try {
    const atProfile = await atGetProfile(slackID);
    const wpProfile = await wpGetProfile(slackID);
    if (atProfile && wpProfile.acf) {
      const profile: IProfile = {
        id: atProfile.id,
        wpid: wpProfile.id,
        name: wpProfile.acf.profile_name,
        email: atProfile.email,
        image: wpProfile.acf.profile_image,
        bio: wpProfile.acf.profile_bio,
        expertise: wpProfile.acf.profile_expertise,
        location: atProfile.location,
        website: wpProfile.acf.profile_website,
        twitter: wpProfile.acf.profile_twitter,
        github: wpProfile.acf.profile_github,
        airport: atProfile.airport,
        airline: atProfile.airline,
        ff: atProfile.ff,
        slack_id: atProfile.slack_id
      }
      console.log('AT+WP: Full User Profile', profile);
      return profile;
    }
    return undefined;
  }
  catch (err) {
    logErr(err);
  }
};

/**
 * Save profile data to multiple data sources and return accumulated saved data
 * Works for both saving new and updating existing profiles
 * @param {IObjectAny} app Slack App
 * @param {IProfile} data profile data from modal form
 * @return {Promise<IProfile>} successfully saved WP and AT data
 */
const saveProfile = async (app: IObjectAny, data: IProfile): Promise<IProfile> => {
  // If editing an existing profile:
  if (data.id && data.wpid) {
    return _atUpdateProfile(app, data);
  } 
  // If adding a new profile
  else {
    return _atAddProfile(app, data);
  }
};

/**
 * Once Airtable profile save is successful, call this function in the success callback
 * This updates WordPress and then aggregates both results together
 * (Airtable API uses callbacks instead of promises, which is a huge pain in the a$$)
 * @param {IObjectAny} app Slack app
 * @param {IProfile} data profile data from form
 * @param {IProfile} atSaved combined data from WP and AT to produce final successfully saved profile
 */
const _atProfileSaved = async (app: IObjectAny, data: IProfile, atSaved: IATProfile): Promise<IProfile> => {
  // Update WordPress profile
  const saveWP: IACFProfile = data.wpid ? await _wpUpdateProfile(data) : await _wpAddProfile(data);
  // Combine normalized values from both AT callback and WP promise
  const normalizedWP = {
    wpid: saveWP.id,
    expertise: saveWP.acf.profile_expertise,
    image: saveWP.acf.profile_image,
    website: saveWP.acf.profile_website,
    twitter: saveWP.acf.profile_twitter,
    github: saveWP.acf.profile_github
  };
  const savedProfile: IProfile = { ...normalizedWP, ...atSaved };
  console.log('AT+WP: Successfully saved user profile', savedProfile);
  // Send Slack DM to submitter confirming successful save
  dmConfirmSaveProfile(app, savedProfile);
  // Send Slack channel message to private admin-only channel
  adminChannelProfileSave(app, savedProfile);
  return savedProfile;
}

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
    slack_id: record.fields["Slack ID"],
    at_link: getAtLink(tableID, viewID, id)
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
    console.log('AIRTABLE: Get User Profile', atProfile);
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
const _atAddProfile = async (app: IObjectAny, data: IProfile): Promise<IATProfile> => {
  const atFields = {
    "Name": data.name,
    "Email": data.email,
    "Location": data.location,
    "Bio": data.bio,
    "Airport Code": data.airport,
    "Preferred Airline": data.airline,
    "Frequent Flyer Account": data.ff,
    "Slack ID": data.slack_id
  };
  return base(table).create([
    {
      "fields": atFields
    }
  ], (err: string, records: IObjectAny[]) => {
    if (err) {
      storeErr(err);
    }
    const savedRecord: IObjectAny = records[0];
    const savedObj: IATProfile = _formatATRecord(savedRecord);
    // console.log('AIRTABLE: Saved new profile', savedObj);
    _atProfileSaved(app, data, savedObj);
    return savedObj;
  });
};

/**
 * Update an existing Airtable ambassador profile data record
 * @param {IObjectAny} app Slack app
 * @param {IProfile} data updates to save to Airtable
 * @return {Promise<IATData>} promise resolving with saved object
 */
const _atUpdateProfile = async (app: IObjectAny, data: IProfile): Promise<IATProfile> => {
  // Retrieve existing record
  return base(table).find(data.id, function (err: string, origRecord: IObjectAny) {
    if (err) {
      storeErr(err);
    }
    if (origRecord) {
      const atFields = {
        "Name": data.name,
        "Email": data.email,
        "Location": data.location,
        "Bio": data.bio,
        "Airport Code": data.airport,
        "Preferred Airline": data.airline,
        "Frequent Flyer Account": data.ff,
        "Slack ID": data.slack_id
      };
      return base(table).update([
        {
          "id": data.id,
          "fields": atFields
        }
      ], async (err: string, records: IObjectAny[]) => {
        if (err) {
          storeErr(err);
        }
        const updatedRecord: IObjectAny = records[0];
        const updatedObj: IATProfile = _formatATRecord(updatedRecord);
        // console.log('AIRTABLE: Updated existing profile', updatedObj);
        _atProfileSaved(app, data, updatedObj);
        return updatedObj;
      });
    }
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
    console.log('WPAPI: Get User Profile', wpProfile);
    return wpProfile;
  }
  catch (err) {
    logErr(err);
  }
};

/**
 * Add Profile from WordPress API
 * Relies on ACF to REST API plugin to work
 * @param {IProfile} data profile data to add
 * @return {Promise<IACFProfile>}
 */
const _wpAddProfile = async (data: IProfile): Promise<IACFProfile> => {
  try {
    const wpFields: IWPProfile = {
      profile_name: data.name,
      profile_bio: data.bio,
      profile_expertise: data.expertise,
      profile_location: data.location,
      profile_website: data.website,
      profile_twitter: data.twitter,
      profile_github: data.github,
      profile_image: data.image,
      slack_id: data.slack_id
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
    // console.log('WPAPI: Saved new profile', acfProfile);
    return acfProfile;
  }
  catch (err) {
    console.error(err);
  }
};

/**
 * Update Profile from WordPress API
 * Relies on ACF to REST API plugin to work
 * @param {IProfile} data profile data to add
 * @return {Promise<IACFProfile>}
 */
const _wpUpdateProfile = async (data: IProfile): Promise<IACFProfile> => {
  try {
    const wpFields: IWPProfile = {
      profile_name: data.name,
      profile_bio: data.bio,
      profile_expertise: data.expertise,
      profile_location: data.location,
      profile_website: data.website,
      profile_twitter: data.twitter,
      profile_github: data.github,
      profile_image: data.image,
      slack_id: data.slack_id
    };
    const updateWpProfile = await wpApi.profiles().id(data.wpid).update({
      title: data.name,
      fields: wpFields,
      status: 'publish'
    });
    const acfProfile: IACFProfile = {
      id: updateWpProfile.id,
      acf: updateWpProfile.acf
    };
    // console.log('WPAPI: Updated existing profile', acfProfile);
    return acfProfile;
  }
  catch (err) {
    console.error(err);
  }
};

export { getProfile, saveProfile, atGetProfile, wpGetProfiles, wpGetProfile };