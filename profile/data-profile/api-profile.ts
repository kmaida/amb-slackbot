import { IObjectAny } from '../../utils/types';
import { IProfile, IATProfile, IWPProfile, IACFProfile } from './../profile.interface';
import { storeErr } from '../../utils/errors';
import { falseyToEmptyStr } from '../../utils/utils';
// Airtable
const base = require('airtable').base(process.env.AIRTABLE_BASE_ID);
const table = process.env.AT_TABLE_PROFILES;
const tableID = process.env.AT_TABLE_ID_PROFILES;
const viewID = process.env.AT_TABLE_VIEW_ID_PROFILES;
import { getATLink } from './../../utils/utils';
// WordPress API
import { wpApi } from './../../data/setup-wpapi';

/*------------------
    AIRTABLE API
------------------*/

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
    const savedID: string = savedRecord.getId();
    const savedObj: IATProfile = {
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
      atLink: getATLink(tableID, viewID, savedID)
    };
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

export { atAddProfile, wpGetProfiles, wpAddProfile };