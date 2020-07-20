import { slackErr } from '../../utils/errors';
import { IObjectAny } from '../../utils/types';
import { IProfile } from '../profile.interface';
import { profileSlackMsg } from './utils-profile';

/*------------------
ADMIN CHANNEL PROFILE SAVE
------------------*/

const adminChannelProfileSave = async (app: IObjectAny, data: IProfile): Promise<any> => {
  const channel: string = process.env.SLACK_ADMIN_CHANNEL_ID;
  const profileMsg: string = profileSlackMsg(data);
  try {
    const sendMsg = await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: channel,
      text: `:card_index: *Profile* added or updated by \`<@${data.slack_id}>\`:\n${profileMsg}\n:link: <${data.at_link}|View in Airtable>`,
      unfurl_links: false
    });
  }
  catch (err) {
    slackErr(app, channel, err);
  }
};

export { adminChannelProfileSave };