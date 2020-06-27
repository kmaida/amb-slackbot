const base = require('airtable').base(process.env.AIRTABLE_BASE_ID);
const table = process.env.AT_TABLE_ACTIVITY;
const tableID = process.env.AIRTABLE_TABLE_ID;
const viewID = process.env.AIRTABLE_TABLE_VIEW_ID;
import { IObjectAny, IActivity } from '../../types';
import { storeErr } from '../../utils/errors';
import dmConfirmSave from './dm-confirm-save-activity';
import adminChannelPublishSave from './admin-channel-publish-save-activity';

/*------------------
  AIRTABLE: TABLE
------------------*/

/**
 * Save a new Airtable data record
 * @param {IObjectAny} App Slack app
 * @param {IActivity} data to save to Airtable
 * @return {Promise<IATData>} promise resolving with saved object
 */
const saveData = async (app: IObjectAny, data: IActivity): Promise<IActivity> => {
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

export { saveData };
