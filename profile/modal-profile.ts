import { slackErr, logErr } from '../utils/errors';
import { IObjectAny } from '../utils/types';
import { blocksModalProfile } from './blocks-modal-profile';
import { getUserInfo } from '../data/data-slack';
import { ISlackUserInfo } from '../data/data-slack.interface';
import { IProfilePrefill, IProfile, IProfileMeta } from './profile.interface';
import { getProfile } from './data-profile/api-profile';
import { parallelReqs, apiTimeout } from '../utils/utils';

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
    const slackID: string = body.user_id || body.user.id;
    let dataProfile: IProfile;
    let userData: ISlackUserInfo;
    const metadata: IProfileMeta = { image: undefined };

    try {
      // Get profile data from AT+WP and Slack user data in parallel
      // Must fetch within 2.7 seconds to prevent trigger ID 3 second timeout
      const allProfileData = await apiTimeout(
        parallelReqs([getProfile(slackID), getUserInfo(slackID, app)]),
      2700);
      dataProfile = allProfileData[0];
      userData = allProfileData[1];
    }
    catch (err) {
      // API calls did not execute in time or one of the promises errored
      console.log(err);
    }

    // If no existing profile is in data stores
    if (!dataProfile) {
      // use Slack user data to prefill
      prefill.name = userData.name;
      prefill.email = userData.email;
    }
    // If profile data exists
    else {
      // Set prefill to fetched data
      prefill = dataProfile;
      // Add Airtable and WordPress IDs to private_metadata
      // so they will be accessible in view submission
      metadata.id = dataProfile.id;
      metadata.wpid = dataProfile.wpid;
    }
    // Always use current Slack user image as profile image
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
