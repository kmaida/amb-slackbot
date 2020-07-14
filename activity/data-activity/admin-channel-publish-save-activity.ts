import { slackErr } from '../../utils/errors';
import { IObjectAny } from '../../utils/types';
import { getAdminSettings } from '../../app-home/admin/api-admin';
import { IAdminDocument } from '../../app-home/app-home.interface';
import { IActivity } from '../activity.interface';

/*------------------
ADMIN CHANNEL PUBLISH SAVE
------------------*/

const adminChannelPublishSave = async (app: IObjectAny, atData: IActivity): Promise<any> => {
  const settings: IAdminDocument = await getAdminSettings();
  const channel: string = settings.channel;
  try {
    const sendMsg = await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: channel,
      text: `:new: *New Activity* submitted by \`<@${atData.slackID}>\`:\n*Name:* ${atData.name}\n*Email:* ${atData.email}\n*Activity Type:* ${atData.type}\n*Title:* ${atData.title}\n*URL:* ${atData.url}\n*Date:* ${atData.date}\n*Topic:* ${atData.topic}\n*Reach:* ${atData.reach}\n<${atData.atLink}|View in Airtable>`,
      unfurl_links: false
    });
  }
  catch (err) {
    slackErr(app, channel, err);
  }
};

export { adminChannelPublishSave };
