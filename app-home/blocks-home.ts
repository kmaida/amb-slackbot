import { btnOpenModalActivity } from '../activity/btn-open-modal-activity';
import { IObjectAny } from '../utils/types';
import { blocksHomeAdmin } from './admin/blocks-home-admin';
import { getAdminSettings } from './admin/api-admin';
import { IAdminDocument } from './app-home.interface';
import { btnOpenModalProfile } from '../profile/btn-open-modal-profile';

/*------------------
 BLOCKS: HOME VIEW
------------------*/

/**
 * Get composed blocks for user App Home view
 * @param {string} userID ID of user who opened home
 * @param {any} metadata any data from home view that should be propagated
 * @return {Promise<IObjectAny[]>} promise of array of block kit objects
 */
const blocksHome = async (userID: string, metadata: any): Promise<IObjectAny[]> => {
  const adminSettings: IAdminDocument = await getAdminSettings();
  const reportingChannel: string = adminSettings.channel;
  const admins: string[] = adminSettings.admins;
  const allUserBlocks: IObjectAny[] = [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `:wave: *Hello, <@${userID}>!* I'm <@${process.env.SLACK_BOT_ID}>.`
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `:mega: Check out what your teammates are reporting in <#${reportingChannel}>.`
      }
    },
    {
      "type": "actions",
      "elements": [
        btnOpenModalActivity(metadata),
        btnOpenModalProfile()
      ]
    }
  ];
  /**
   * Determine if user is admin
   * If admin, add admin blocks to view
   * @return {IObjectAny[]} array of home block objects
   */
  const composeHomeBlocks = (): IObjectAny[] => {
    if (admins.indexOf(userID) > -1) {
      const admin = blocksHomeAdmin(reportingChannel, admins);
      return [...allUserBlocks, ...admin];
    } else {
      return allUserBlocks;
    }
  };
  /**
   * @return composed blocks for appropriate home view for this user (admin or non-admin)
   */
  return composeHomeBlocks();
}

export { blocksHome };
