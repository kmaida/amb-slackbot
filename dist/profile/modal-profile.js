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
exports.modalProfile = void 0;
const errors_1 = require("../utils/errors");
const blocks_modal_profile_1 = require("./blocks-modal-profile");
const data_slack_1 = require("../data/data-slack");
const api_profile_1 = require("./data-profile/api-profile");
const utils_1 = require("../utils/utils");
/*------------------
PROFILE MODAL FORM
    Command
    Shortcut
    Button
------------------*/
const modalProfile = (app) => {
    const openDialog = ({ ack, body, context }) => __awaiter(void 0, void 0, void 0, function* () {
        yield ack();
        let prefill = {};
        let dataProfile;
        let userData;
        const slackID = body.user_id || body.user.id;
        const metadata = { image: undefined };
        const _setImage = (img) => {
            // Always use current Slack user image as profile image
            const image = img.replace('"', '');
            metadata.image = image;
            prefill.image = image;
        };
        try {
            // Get profile data from AT+WP and Slack user data in parallel
            // Must fetch within 2.7 seconds to prevent trigger ID 3 second timeout
            const fetchProfileData = Promise.all([api_profile_1.getProfile(slackID), data_slack_1.getUserInfo(slackID, app)]);
            const allProfileData = yield utils_1.apiTimeout(fetchProfileData, 2700);
            dataProfile = allProfileData[0];
            userData = allProfileData[1];
        }
        catch (err) {
            // API calls did not execute in time or one of the promises errored
            console.log(err);
            // There won't be any prefill information available but further execution won't be blocked
        }
        // If no existing profile is in data stores but userData is available
        if (!dataProfile && userData) {
            // use Slack user data to prefill
            prefill.name = userData.name;
            prefill.email = userData.email;
            _setImage(userData.image);
        }
        // If profile data exists
        if (dataProfile && userData) {
            // Set prefill to fetched data
            prefill = dataProfile;
            _setImage(userData.image);
            // Add Airtable and WordPress IDs to private_metadata
            // so they will be accessible in view submission
            metadata.id = dataProfile.id;
            metadata.wpid = dataProfile.wpid;
        }
        // Set up profile modal view
        try {
            const profileView = yield app.client.views.open({
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
                    blocks: blocks_modal_profile_1.blocksModalProfile(prefill),
                    submit: {
                        type: 'plain_text',
                        text: 'Save Profile'
                    }
                }
            });
        }
        catch (err) {
            errors_1.slackErr(app, slackID, err);
        }
    });
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
exports.modalProfile = modalProfile;
//# sourceMappingURL=modal-profile.js.map