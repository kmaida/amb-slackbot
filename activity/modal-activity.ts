import { slackErr, logErr } from '../utils/errors';
import { IObjectAny } from '../utils/types';
import { blocksModalActivity } from './blocks-modal-activity';
import { getUserInfo } from '../data/data-slack';
import { ISlackUserInfo } from '../data/data-slack.interface';
import { IActivityPrefill } from './activity.interface';

/*------------------
 MODAL DIALOG FORM
    Command
    Shortcut
    Button
------------------*/

const modalActivity = (app: IObjectAny): void => {
  const openDialog = async ({ ack, body, context }) => {
    await ack();
    let userData: ISlackUserInfo;
    const prefill: IActivityPrefill = {};
    const slackID = body.user.id;
    /**
     * PASSING DATA FROM INTERACTION TO VIEW SUBMISSION:
     * Hidden metadata can be sent in the modal view as private_metadata to modal-view-submit.ts.
     * Any data available in params here (e.g., body, context) is available to use as metadata.
     * This data comes from the interaction (command, shortcut, or button action) that triggers this modal.
     * The data varies in format depending on which trigger is used; uncomment the console log
     * below to examine this payload further.
     */
    // console.log(body.actions);
    // If button value metadata is available, set it as metadata (e.g., useful for getting home view data or prefill data passed in as a button value from an "Edit" button, etc.)
    const btnMetadata = JSON.stringify(body.actions ? body.actions[0].value : {});
    // @TODO: get activity prefill from btnMetadata here and set, if available

    // Get user data from Slack
    try {
      userData = await getUserInfo(slackID, app);
      if (!prefill.name && !prefill.email) {
        prefill.name = userData.name;
        prefill.email = userData.email;
      }
    }
    catch (err) {
      logErr(err);
    }
    // Set up activity modal view
    try {
      const activityView = await app.client.views.open({
        token: context.botToken,
        trigger_id: body.trigger_id,
        view: {
          type: 'modal',
          callback_id: 'add_activity',
          private_metadata: btnMetadata,
          title: {
            type: 'plain_text',
            text: 'Add Activity'
          },
          blocks: blocksModalActivity(prefill),
          submit: {
            type: 'plain_text',
            text: 'Save'
          }
        }
      });
    }
    catch (err) {
      slackErr(app, slackID, err);
    }
  };

  /**
   * Interactions that trigger the activity modal
   */
  // Slash command: /activity
  app.command('/activity', openDialog);
  // Global shortcut callback: add_activity
  app.shortcut('add_activity', openDialog);
  // Button from App Home
  app.action('btn_open_modal_activity', openDialog);
};

export { modalActivity };
