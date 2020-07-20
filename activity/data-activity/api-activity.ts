import { IObjectAny } from '../../utils/types';
import { IActivity, IWPActivity, IACFActivity } from './../activity.interface';
import { storeErr } from '../../utils/errors';
import { dmConfirmSaveActivity } from './dm-confirm-save-activity';
import { adminChannelActivitySave } from './admin-channel-publish-save-activity';
// Airtable
const base = require('airtable').base(process.env.AIRTABLE_BASE_ID);
const table = process.env.AT_TABLE_ACTIVITY;
const tableID = process.env.AT_TABLE_ID_ACTIVITY;
const viewID = process.env.AT_TABLE_VIEW_ID_ACTIVITY;
import { getQ, getAtLink } from './../../utils/utils';
// WordPress API
import { wpApi } from './../../data/setup-wpapi';
import { channelPublishSave } from './channel-publish-save';

/*------------------
    AIRTABLE API
------------------*/

/**
 * Save a new Airtable activity data record
 * @param {IObjectAny} app Slack app
 * @param {IActivity} data to save to Airtable
 * @return {Promise<IATData>} promise resolving with saved object
 */
const atAddActivity = async (app: IObjectAny, data: IActivity): Promise<IActivity> => {
  const atFields = {
    "Name": data.name,
    "Email": data.email,
    "Activity Type": data.type,
    "Title": data.title,
    "Date": data.date,
    "URL": data.url,
    "Topic": data.topic,
    "Reach": data.reach,
    "Quarter": getQ(data.date),
    "Slack ID": data.slack_id
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
      slack_id: savedRecord.fields["Slack ID"],
      at_link: getAtLink(tableID, viewID, savedID)
    };
    console.log('AIRTABLE: Saved new activity', savedObj);
    // Send Slack DM to submitter confirming successful save
    dmConfirmSaveActivity(app, savedObj);
    // Send Slack channel message to private admin-only channel
    adminChannelActivitySave(app, savedObj);
    return savedObj;
  });
};

/*------------------
   WORDPRESS API
------------------*/

/**
 * Get Activities from ACF API (custom post type consisting of only ACF fields)
 * @return {IACFActivity[]} array of activity objects from WP
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
 * This will only happen if user opts into public publishing
 * @param {IObjectAny} app Slack app
 * @param {IActivity} data activity data to add
 * @return {Promise<IACFActivity>}
 */
const wpAddActivity = async (app: IObjectAny, data: IActivity): Promise<IACFActivity> => {
  try {
    const wpFields: IWPActivity = {
      activity_name: data.name,
      activity_type: data.type,
      activity_title: data.title,
      activity_date: data.date,
      activity_url: data.url,
      activity_topic: data.topic,
      slack_id: data.slack_id
    };
    const addWpActivity = await wpApi.activities().create({
      title: data.title,
      content: '',
      fields: wpFields,
      status: 'publish'
    });
    const acfActivity: IACFActivity = {
      id: addWpActivity.id,
      acf: addWpActivity.acf
    };
    console.log('WPAPI: Saved new activity', acfActivity);
    // Publish activity to public Slack channel
    channelPublishSave(app, acfActivity.acf);
    return acfActivity;
  }
  catch (err) {
    console.error(err);
  }
};

export { atAddActivity, wpGetActivities, wpAddActivity };
