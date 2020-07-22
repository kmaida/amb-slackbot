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
exports.submitModalProfile = void 0;
const utils_1 = require("../utils/utils");
const form_validation_1 = require("../utils/form-validation");
const errors_1 = require("../utils/errors");
const api_profile_1 = require("./data-profile/api-profile");
/*------------------
PROFILE SUBMIT VIEW
------------------*/
const submitModalProfile = (app) => {
    // Modal view submitted
    app.view('profile', ({ ack, body, view }) => __awaiter(void 0, void 0, void 0, function* () {
        const slackID = body.user.id;
        const metadata = view.private_metadata ? JSON.parse(view.private_metadata) : {};
        const payload = view.state.values;
        // Capture data from modal interactions
        // Modal blocks data format: payload.[block_id].[action_id].[value]
        const data = {
            name: payload.bp_name.ap_name.value,
            email: payload.bp_email.ap_email.value,
            location: payload.bp_location.ap_location.value,
            bio: payload.bp_bio.ap_bio.value,
            image: metadata.image,
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
        const ackParams = {
            response_action: 'errors',
            errors: {}
        };
        if (!form_validation_1.emailIsh(data.email)) {
            ackParams.errors.bp_email = 'Please provide a valid email.';
        }
        if (data.website && !form_validation_1.validUrl(data.website)) {
            ackParams.errors.bp_website = 'Please provide a valid URL.';
        }
        if (data.twitter && !form_validation_1.validUrl(data.twitter, 'twitter.com')) {
            ackParams.errors.bp_twitter = 'Please provide a valid Twitter profile URL, e.g. https://twitter.com/[YourUsername].';
        }
        if (data.github && !form_validation_1.validUrl(data.github, 'github.com')) {
            ackParams.errors.bp_github = 'Please provide a valid GitHub page URL, e.g. https://github.com/[YourUsername].';
        }
        if (data.airport && !form_validation_1.validAirport(data.airport)) {
            ackParams.errors.bp_airport = 'Please enter a 3-letter airport code.';
        }
        if (utils_1.objNotEmpty(ackParams.errors)) {
            yield ack(ackParams);
            return;
        }
        yield ack();
        // Save profile to Airtable and WordPress
        try {
            const save = yield api_profile_1.saveProfile(app, data);
        }
        catch (err) {
            errors_1.slackErr(app, slackID, err);
        }
    }));
};
exports.submitModalProfile = submitModalProfile;
//# sourceMappingURL=modal-view-submit-profile.js.map