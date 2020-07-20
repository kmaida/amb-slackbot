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
        const slackID = body.user.id;
        const getDataProfile = yield api_profile_1.getProfile(slackID);
        const userData = yield data_slack_1.getUserInfo(slackID, app);
        let metadata = {};
        // Check if data exists in databases
        if (!getDataProfile) {
            // If no data exists, use Slack user data to prefill
            prefill.name = userData.name;
            prefill.email = userData.email;
        }
        else {
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