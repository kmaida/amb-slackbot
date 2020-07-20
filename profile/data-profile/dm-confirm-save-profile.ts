import { slackErr } from '../../utils/errors';
import { IObjectAny } from '../../utils/types';
import { IProfile } from '../profile.interface';
import { profileSlackMsg } from './utils-profile';

/*------------------
DM CONFIRM SAVE PROFILE
------------------*/

const dmConfirmSaveProfile = async (app: IObjectAny, data: IProfile): Promise<any> => {
  const userID: string = data.slack_id;
  const profileMsg: string = profileSlackMsg(data);
  try {
    const sendMsg = await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: userID,
      text: `:tada: Your profile has been saved successfully!\n${profileMsg}`,
      unfurl_links: false
    });
  }
  catch (err) {
    slackErr(app, userID, err);
  }
};

export { dmConfirmSaveProfile };