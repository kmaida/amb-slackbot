import { slackErr } from '../../utils/errors';
import { IObjectAny } from '../../utils/types';
import { IActivity } from '../activity.interface';

/*------------------
ADMIN CHANNEL ACTIVITY SAVE
------------------*/

const adminChannelActivitySave = async (app: IObjectAny, atData: IActivity): Promise<any> => {
  const channel: string = process.env.SLACK_ADMIN_CHANNEL_ID;
  try {
    const sendMsg = await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: channel,
      text: `:new: *New Activity* submitted by \`<@${atData.slack_id}>\`:\n*Name:* ${atData.name}\n*Email:* ${atData.email}\n*Activity Type:* ${atData.type}\n*Title:* ${atData.title}\n*URL:* ${atData.url}\n*Date:* ${atData.date}\n*Topic:* ${atData.topic}\n*Reach:* ${atData.reach}\n:link: <${atData.at_link}|View in Airtable>`,
      unfurl_links: false
    });
  }
  catch (err) {
    slackErr(app, channel, err);
  }
};

export { adminChannelActivitySave };
