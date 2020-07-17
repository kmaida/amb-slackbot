import * as cron from 'cron';
import { IObjectAny } from './types';
import { updateAllHomes } from '../app-home/update-view-home';
import { slackErr, logErr } from './errors';

/*------------------
   SCHEDULED JOBS
------------------*/

/**
 * Sync all Airtable items
 * This should be used by admins when it's necessary to sync manual updates in AT
 * @param {IObjectAny} app Slack app
 * @param {string} userID (optional) user ID present if user is admin
 * @return {Promise<void>}
 */
const syncAT = async (app: IObjectAny, userID?: string): Promise<void> => {
  // @TODO: get all items that show up in home view
  // @TODO: e.g., activities, pending requests, swag requests, booking data, etc.
  try {
    // Update app home view for all users who have opened app home
    const updateHomes = updateAllHomes(app);
  }
  catch (err) {
    // If admin-initiated, send errors in DM
    if (userID) {
      slackErr(app, userID, err);
    } else {
      logErr(err);
    }
  }
  // If admin-initiated, confirm events synced with admin user in DM
  // if (userID) dmSyncEvents(app, userID, errSlack);
};

const scheduleATSyncs = (app: IObjectAny): void => {
  const job = new cron.CronJob({
    cronTime: '0 0 * * *',
    onTick: syncAT(app),
    timeZone: 'America/Detroit'
  });
  // Log next 3 scheduled dates
  console.log('JOBS: next 3 nightly event syncs scheduled for', job.nextDates(3).map(date => date.toString()));
  job.start();
}

export { syncAT, scheduleATSyncs };