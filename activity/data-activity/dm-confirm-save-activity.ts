import { slackErr } from '../../utils/errors';
import { IObjectAny } from '../../utils/types';
import { IActivity } from '../activity.interface';

/*------------------
  DM CONFIRM SAVE
------------------*/

const dmConfirmSave = async (app: IObjectAny, atData: IActivity): Promise<any> => {
  const userID: string = atData.slack_id;
  try {
    const sendMsg = await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: userID,
      text: `:tada: Your activity has been saved successfully. Thank you for your contribution!\n*Activity Type:* ${atData.type}\n*Title:* ${atData.title}\n*URL:* ${atData.url}\n*Date:* ${atData.date}\n*Topic:* ${atData.topic}\n*Reach:* ${atData.reach}`,
      unfurl_links: false
    });
  }
  catch (err) {
    slackErr(app, userID, err);
  }
};

export { dmConfirmSave };
