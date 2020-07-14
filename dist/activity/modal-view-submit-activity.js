"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitModalActivity = void 0;
const utils_1 = require("../utils/utils");
const api_activity_1 = require("./data-activity/api-activity");
const errors_1 = require("../utils/errors");
/*------------------
  MODAL VIEW SUBMIT
------------------*/
const submitModalActivity = (app) => {
    // Modal view submitted
    app.view('add_airtable_data', ({ ack, body, view }) => __awaiter(void 0, void 0, void 0, function* () {
        const userID = body.user.id;
        const metadata = view.private_metadata ? JSON.parse(view.private_metadata) : {};
        console.log('Metadata received from modal form:', metadata);
        const payload = view.state.values;
        // Capture data from modal interactions
        // Modal blocks data format: payload.[block_id].[action_id].value
        const data = {
            name: payload.b_name.a_name.value,
            email: payload.b_email.a_email.value,
            type: payload.b_type.a_type.selected_option,
            title: payload.b_title.a_title.value,
            date: payload.b_date.a_date.value,
            url: payload.b_url.a_url.value,
            topic: payload.b_topic.a_topic.value,
            reach: payload.b_reach.a_reach.value,
            slackID: userID
        };
        // Validate form fields and handle errors
        // https://api.slack.com/surfaces/modals/using#displaying_errors#displaying_errors
        const ackParams = {
            response_action: 'errors',
            errors: {}
        };
        if (!utils_1.validUrl(data.url)) {
            ackParams.errors.b_url = 'Please provide a valid URL.';
        }
        if (utils_1.objNotEmpty(ackParams.errors)) {
            yield ack(ackParams);
            return;
        }
        yield ack();
        // Save data to Airtable
        // @TODO: save activity in api-activity (create new endpoint)
        // @TODO: save to WordPress
        try {
            const saveActivityToAirtable = yield api_activity_1.atAddActivity(app, data);
        }
        catch (err) {
            errors_1.slackErr(app, userID, err);
        }
    }));
};
exports.submitModalActivity = submitModalActivity;
//# sourceMappingURL=modal-view-submit-activity.js.map