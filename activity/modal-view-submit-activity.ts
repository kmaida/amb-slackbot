import { IObjectAny } from '../utils/types';
import { objNotEmpty } from '../utils/utils';
import { validUrl, validNumber, emailIsh, dateCompare } from '../utils/form-validation';
import { atAddActivity, wpAddActivity } from './data-activity/api-activity';
import { slackErr } from '../utils/errors';
import { IActivity } from './activity.interface';

/*------------------
  MODAL VIEW SUBMIT
------------------*/

const submitModalActivity = (app: IObjectAny): void => {
  // Modal view submitted
  app.view('add_activity', async ({ ack, body, view }) => {
    const userID: string = body.user.id;
    const metadata: IObjectAny = view.private_metadata ? JSON.parse(view.private_metadata) : {};
    console.log('Metadata received from modal form:', metadata);
    const payload: IObjectAny = view.state.values;
    // Capture data from modal interactions
    // Modal blocks data format: payload.[block_id].[action_id].value
    const data: IActivity = {
      name: payload.ba_name.aa_name.value,
      email: payload.ba_email.aa_email.value,
      type: payload.ba_type.aa_type.selected_option.value,
      title: payload.ba_title.aa_title.value,
      date: payload.ba_date.aa_date.selected_date,
      url: payload.ba_url.aa_url.value,
      topic: payload.ba_topic.aa_topic.value,
      reach: payload.ba_reach.aa_reach.value * 1,
      slackID: userID
    };
    const isPublic: boolean = !!payload.ba_public.aa_public.selected_options;
    // Validate form fields and handle errors
    // https://api.slack.com/surfaces/modals/using#displaying_errors#displaying_errors
    const ackParams: any = {
      response_action: 'errors',
      errors: {}
    };
    if (!emailIsh(data.email)) {
      ackParams.errors.ba_email = 'Please provide a valid email.';
    }
    if (!validUrl(data.url)) {
      ackParams.errors.ba_url = 'Please provide a valid URL.';
    }
    if (!dateCompare(data.date)) {
      ackParams.errors.ba_date = 'The provided date is in the future. Please complete an activity before submitting it.';
    }
    if (!validNumber(data.reach)) {
      ackParams.errors.ba_reach = 'Reach must be an integer.'
    }
    if (objNotEmpty(ackParams.errors)) {
      await ack(ackParams);
      return;
    }
    await ack();

    // Save activity to Airtable
    try {
      const saveActivityToAirtable = await atAddActivity(app, data);
    }
    catch (err) {
      slackErr(app, userID, err);
    }
    // If activity is public
    if (isPublic) {
      // Save activity to WordPress
      try {
        const saveActivityToWordPress = await wpAddActivity(app, data);
      }
      catch (err) {
        slackErr(app, userID, err);
      }
    }
  });
};

export { submitModalActivity };
