import { slackErr, logErr } from '../utils/errors';
import { IObjectAny } from '../utils/types';
import { blocksModalProfile } from './blocks-modal-profile';
import { getUserInfo } from '../data/data-slack';
import { ISlackUserInfo } from '../data/data-slack.interface';
import { IProfilePrefill, IProfile } from './profile.interface';
import { getProfile } from './data-profile/api-profile';

/*------------------
PROFILE MODAL FORM
    Command
    Shortcut
    Button
------------------*/

const modalProfile = (app: IObjectAny): void => {
  const openDialog = async ({ ack, body, context }) => {
    await ack();
    let prefill: IProfilePrefill = {};
    const slackID: string = body.user.id;
    const getDataProfile: IProfile = await getProfile(slackID);
    const userData: ISlackUserInfo = await getUserInfo(slackID, app);
    let metadata: IObjectAny = {};
    // Check if data exists in databases
    if (!getDataProfile) {
      // If no data exists, use Slack user data to prefill
      prefill.name = userData.name;
      prefill.email = userData.email;
    } else {
      // If data exists
      prefill = getDataProfile;
      metadata.id = getDataProfile.id;
      metadata.wpid = getDataProfile.wpid;
    }
    // Use current Slack profile image as image
    const image = userData.image.replace('"', '');
    metadata.image = image;
    prefill.image = image;

    // Set up profile modal view
    try {
      const profileView = await app.client.views.open({
        token: context.botToken,
        trigger_id: body.trigger_id,
        view: {
          type: 'modal',
          callback_id: 'profile',
          title: {
            type: 'plain_text',
            text: 'Manage Profile'
          },
          private_metadata: JSON.stringify(metadata),
          blocks: blocksModalProfile(prefill),
          submit: {
            type: 'plain_text',
            text: 'Save Profile'
          }
        }
      });
    }
    catch (err) {
      slackErr(app, slackID, err);
    }
  };

  /**
   * Interactions that trigger the profile modal
   */
  // Slash command: /profile
  app.command('/profile', openDialog);
  // Global shortcut callback: profile
  app.shortcut('profile', openDialog);
  // Button from App Home
  app.action('btn_open_modal_profile', openDialog);
};

export { modalProfile };
