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
        const slackID = body.user_id || body.user.id;
        const metadata = {};
        try {
            // Get profile data from AT+WP
            // Must fetch within 2.5 seconds to prevent trigger ID 3 second timeout
            dataProfile = yield utils_1.apiTimeout(api_profile_1.getProfile(slackID), 2500);
        }
        catch (err) {
            // API call did not execute in time or errored
            console.log(err);
            // There won't be any prefill information available but further execution won't be blocked
        }
        // If profile data exists
        if (dataProfile) {
            // Set prefill to fetched data
            prefill = dataProfile;
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