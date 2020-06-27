import { IObjectAny, IActivity } from '../types';
import { validUrl, objNotEmpty } from '../utils/utils';
import { saveData } from './data-activity/api-activity';
import { slackErr } from '../utils/errors';

/*------------------
  MODAL VIEW SUBMIT
------------------*/

const submitModal = (app: IObjectAny): void => {
  // Modal view submitted
  app.view('add_airtable_data', async ({ ack, body, view }) => {
    const userID: string = body.user.id;
    const metadata: IObjectAny = view.private_metadata ? JSON.parse(view.private_metadata) : {};
    console.log('Metadata received from modal form:', metadata);
    const payload: IObjectAny = view.state.values;
    // Capture data from modal interactions
    // Modal blocks data format: payload.[block_id].[action_id].value
    const data: IActivity = {
      name: payload.b_name.a_name.value,
      email: payload.b_email.a_email.value,
      type: payload.b_type.a_type.selected_option,
      title: payload.b_title.a_title.value,
      date: payload.b_date.a_date.value,
      url: payload.b_url.a_url.value,
      topic: payload.b_topic.a_topic.value,
      slackID: userID
    };
    // Validate form fields and handle errors
    // https://api.slack.com/surfaces/modals/using#displaying_errors#displaying_errors
    const ackParams: any = {
      response_action: 'errors',
      errors: {}
    };
    if (!validUrl(data.url)) {
      ackParams.errors.b_url = 'Please provide a valid URL.';
    }
    if (objNotEmpty(ackParams.errors)) {
      await ack(ackParams);
      return;
    }
    await ack();
    // Save data to Airtable
    try {
      const saveActivityToAirtable = await saveData(app, data);
    }
    catch (err) {
      slackErr(app, userID, err);
    }
  });
};

export default submitModal;
