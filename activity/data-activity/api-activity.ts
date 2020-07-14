import { IObjectAny, IActivity, IWPActivity, IACFActivity } from '../../utils/types';
import { storeErr } from '../../utils/errors';
import dmConfirmSave from './dm-confirm-save-activity';
import adminChannelPublishSave from './admin-channel-publish-save-activity';
// Airtable
const base = require('airtable').base(process.env.AIRTABLE_BASE_ID);
const table = process.env.AT_TABLE_ACTIVITY;
const tableID = process.env.AT_TABLE_ID_ACTIVITY;
const viewID = process.env.AT_TABLE_VIEW_ID_ACTIVITY;
import { getQ } from './../../utils/utils';
// WordPress API
import { wpApi } from './../../data/setup-wpapi';

/*------------------
    AIRTABLE API
------------------*/

/**
 * Save a new Airtable data record
 * @param {IObjectAny} App Slack app
 * @param {IActivity} data to save to Airtable
 * @return {Promise<IATData>} promise resolving with saved object
 */
const atAddActivity = async (app: IObjectAny, data: IActivity): Promise<IActivity> => {
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
        "Quarter": getQ(data.date),
        "Slack ID": data.slackID
      }
    }
  ], (err: string, records: IObjectAny) => {
    if (err) {
      storeErr(err);
    }
    const savedRecord: IObjectAny = records[0];
    const savedID: string = savedRecord.getId();
    const savedObj: IActivity = {
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
    dmConfirmSave(app, savedObj);
    // Send Slack channel message to private admin-only channel
    adminChannelPublishSave(app, savedObj);
    // @NOTE: If you want to update home view: need to have passed user's app home view ID
    return savedObj;
  });
}

/*------------------
   WORDPRESS API
------------------*/

/**
 * Get Activities from ACF API (custom post type consisting of only ACF fields)
 * @returns {IACFActivity[]} array of activity objects from WP
 */
const wpGetActivities = async (): Promise<IACFActivity[]> => {
  try {
    const getActivities: IObjectAny[] = await wpApi.activities();
    const activities: IACFActivity[] = [];
    getActivities.forEach((activity: IObjectAny) => {
      const acf: IWPActivity = activity.acf;
      const obj: IACFActivity = {
        id: activity.id,
        acf: acf
      }
      activities.push(obj);
    });
    console.log('WPAPI: Activities', activities);
    return activities;
  }
  catch (err) {
    console.error(err);
  }
};

/**
 * Add Activity from WordPress API
 * Relies on ACF to REST API plugin to work
 * @param {IWPActivity} data activity data to add
 * @returns {Promise<IACFActivity>}
 */
const wpAddActivity = async (data: IWPActivity): Promise<IACFActivity> => {
  try {
    const addWpActivity = await wpApi.activities().create({
      title: data.activity_title,
      content: '',
      fields: data,
      status: 'publish'
    });
    const acfActivity: IACFActivity = {
      id: addWpActivity.id,
      acf: addWpActivity.acf
    };
    console.log('WPAPI: Successfully saved activity', acfActivity);
    return acfActivity;
  }
  catch (err) {
    console.error(err);
  }
};

export { atAddActivity, wpGetActivities, wpAddActivity };
