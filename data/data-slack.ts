import { ISlackUserInfo } from './data-slack.interface';
import { IObjectAny } from '../utils/types';
import { logErr } from '../utils/errors';

/*------------------
     SLACK API
------------------*/

/**
 * Get user profile data from Slack API
 * @param {string} userID Slack user ID
 * @param {IObjectAny} app Slack App
 * @returns {Promise<ISlackUserInfo>}
 */
const getUserInfo = async (userID: string, app: IObjectAny): Promise<ISlackUserInfo> => {
  try {
    const _slackUserInfo: IObjectAny = await app.client.users.info({
      token: process.env.SLACK_BOT_TOKEN,
      user: userID
    });
    // console.log(_slackUserInfo);
    // Pull out only desired info from Slack user profile
    const userData: ISlackUserInfo = {
      name: _slackUserInfo.user.profile.real_name_normalized,
      email: _slackUserInfo.user.profile.email,
      image: _slackUserInfo.user.profile.image_512
    };
    return userData;
  }
  catch (err) {
    logErr(err);
  }
};

export { getUserInfo };
