import { IObjectAny } from '../utils/types';
import { objNotEmpty } from '../utils/utils';
import { validUrl, emailIsh, validAirport } from '../utils/form-validation';
import { slackErr, logErr } from '../utils/errors';
import { IProfile, IProfileMeta } from './profile.interface';
import { saveProfile } from './data-profile/api-profile';

/*------------------
PROFILE SUBMIT VIEW
------------------*/

const submitModalProfile = (app: IObjectAny): void => {
  // Modal view submitted
  app.view('profile', async ({ ack, body, view }) => {
    const slackID: string = body.user.id;
    const metadata: IProfileMeta = view.private_metadata ? JSON.parse(view.private_metadata) : {};
    const payload: IObjectAny = view.state.values;
    // Capture data from modal interactions
    // Modal blocks data format: payload.[block_id].[action_id].value
    const data: IProfile = {
      name: payload.bp_name.ap_name.value,
      email: payload.bp_email.ap_email.value,
      image: metadata.image,
      location: payload.bp_location.ap_location.value,
      bio: payload.bp_bio.ap_bio.value,
      expertise: payload.bp_expertise.ap_expertise.value,
      website: payload.bp_website.ap_website.value,
      twitter: payload.bp_twitter.ap_twitter.value,
      github: payload.bp_github.ap_github.value,
      airport: payload.bp_airport.ap_airport.value,
      airline: payload.bp_airline.ap_airline.value,
      ff: payload.bp_ff.ap_ff.value,
      slack_id: slackID
    };
    // Add Airtable and WP IDs to profile data if editing existing profile
    if (metadata.id && metadata.wpid) {
      data.id = metadata.id;
      data.wpid = metadata.wpid;
    }
    // Validate form fields and handle errors
    // https://api.slack.com/surfaces/modals/using#displaying_errors#displaying_errors
    const ackParams: any = {
      response_action: 'errors',
      errors: {}
    };
    if (!emailIsh(data.email)) {
      ackParams.errors.bp_email = 'Please provide a valid email.';
    }
    if (data.website && !validUrl(data.website)) {
      ackParams.errors.bp_website = 'Please provide a valid URL.';
    }
    if (data.twitter && !validUrl(data.twitter, 'twitter.com')) {
      ackParams.errors.bp_twitter = 'Please provide a valid Twitter profile URL, e.g. https://twitter.com/[YourUsername].';
    }
    if (data.github && !validUrl(data.github, 'github.com')) {
      ackParams.errors.bp_github = 'Please provide a valid GitHub page URL, e.g. https://github.com/[YourUsername].';
    }
    if (data.airport && !validAirport(data.airport)) {
      ackParams.errors.bp_airport = 'Please enter a 3-letter airport code.';
    }
    if (objNotEmpty(ackParams.errors)) {
      await ack(ackParams);
      return;
    }
    await ack();

    // Save profile to Airtable and WordPress
    try {
      const save = await saveProfile(app, data);
    }
    catch (err) {
      slackErr(app, slackID, err);
    }
  });
};

export { submitModalProfile };
