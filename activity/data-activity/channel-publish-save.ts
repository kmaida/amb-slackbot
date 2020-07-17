import { slackErr } from '../../utils/errors';
import { IObjectAny } from '../../utils/types';
import { IWPActivity } from '../activity.interface';
import { getAdminSettings } from '../../app-home/admin/api-admin';

/*------------------
PUBLIC CHANNEL PUBLISH SAVE
------------------*/

const channelPublishSave = async (app: IObjectAny, wpData: IWPActivity): Promise<any> => {
  const settings = await getAdminSettings();
  const channel: string = settings.channel;
  try {
    const sendMsg = await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: channel,
      text: `:new: *New Activity* submitted by \`<@${wpData.slack_id}>\`:\n*Name:* ${wpData.activity_name}\n*Activity Type:* ${wpData.activity_type}\n*Title:* ${wpData.activity_title}\n*URL:* ${wpData.activity_url}\n*Date:* ${wpData.activity_date}\n*Topic:* ${wpData.activity_topic}`,
      unfurl_links: false
    });
  }
  catch (err) {
    slackErr(app, channel, err);
  }
};

export { channelPublishSave };
