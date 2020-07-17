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
const form_validation_1 = require("../utils/form-validation");
const api_activity_1 = require("./data-activity/api-activity");
const errors_1 = require("../utils/errors");
/*------------------
  MODAL VIEW SUBMIT
------------------*/
const submitModalActivity = (app) => {
    // Modal view submitted
    app.view('add_activity', ({ ack, body, view }) => __awaiter(void 0, void 0, void 0, function* () {
        const userID = body.user.id;
        const metadata = view.private_metadata ? JSON.parse(view.private_metadata) : {};
        console.log('Metadata received from modal form:', metadata);
        const payload = view.state.values;
        // Capture data from modal interactions
        // Modal blocks data format: payload.[block_id].[action_id].value
        const data = {
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
        const isPublic = !!payload.ba_public.aa_public.selected_options;
        // Validate form fields and handle errors
        // https://api.slack.com/surfaces/modals/using#displaying_errors#displaying_errors
        const ackParams = {
            response_action: 'errors',
            errors: {}
        };
        if (!form_validation_1.emailIsh(data.email)) {
            ackParams.errors.ba_email = 'Please provide a valid email.';
        }
        if (!form_validation_1.validUrl(data.url)) {
            ackParams.errors.ba_url = 'Please provide a valid URL.';
        }
        if (!form_validation_1.dateCompare(data.date)) {
            ackParams.errors.ba_date = 'The provided date is in the future. Please complete an activity before submitting it.';
        }
        if (!form_validation_1.validNumber(data.reach)) {
            ackParams.errors.ba_reach = 'Reach must be an integer.';
        }
        if (utils_1.objNotEmpty(ackParams.errors)) {
            yield ack(ackParams);
            return;
        }
        yield ack();
        // Save activity to Airtable
        try {
            const saveActivityToAirtable = yield api_activity_1.atAddActivity(app, data);
        }
        catch (err) {
            errors_1.slackErr(app, userID, err);
        }
        // If activity is public
        if (isPublic) {
            // Save activity to WordPress
            try {
                const saveActivityToWordPress = yield api_activity_1.wpAddActivity(app, data);
            }
            catch (err) {
                errors_1.slackErr(app, userID, err);
            }
        }
    }));
};
exports.submitModalActivity = submitModalActivity;
//# sourceMappingURL=modal-view-submit-activity.js.map