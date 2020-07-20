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
exports.modalActivity = void 0;
const errors_1 = require("../utils/errors");
const blocks_modal_activity_1 = require("./blocks-modal-activity");
const data_slack_1 = require("../data/data-slack");
/*------------------
 MODAL DIALOG FORM
    Command
    Shortcut
    Button
------------------*/
const modalActivity = (app) => {
    const openDialog = ({ ack, body, context }) => __awaiter(void 0, void 0, void 0, function* () {
        yield ack();
        let userData;
        const prefill = {};
        const slackID = body.user.id;
        /**
         * PASSING DATA FROM INTERACTION TO VIEW SUBMISSION:
         * Hidden metadata can be sent in the modal view as private_metadata to modal-view-submit.ts.
         * Any data available in params here (e.g., body, context) is available to use as metadata.
         * This data comes from the interaction (command, shortcut, or button action) that triggers this modal.
         * The data varies in format depending on which trigger is used; uncomment the console log
         * below to examine this payload further.
         */
        // console.log(body.actions);
        // If button value metadata is available, set it as metadata (e.g., useful for getting home view data or prefill data passed in as a button value from an "Edit" button, etc.)
        const btnMetadata = JSON.stringify(body.actions ? body.actions[0].value : {});
        // @TODO: get activity prefill from btnMetadata here and set, if available
        // Get user data from Slack
        try {
            userData = yield data_slack_1.getUserInfo(slackID, app);
            if (!prefill.name && !prefill.email) {
                prefill.name = userData.name;
                prefill.email = userData.email;
            }
        }
        catch (err) {
            errors_1.logErr(err);
        }
        // Set up activity modal view
        try {
            const activityView = yield app.client.views.open({
                token: context.botToken,
                trigger_id: body.trigger_id,
                view: {
                    type: 'modal',
                    callback_id: 'add_activity',
                    private_metadata: btnMetadata,
                    title: {
                        type: 'plain_text',
                        text: 'Add Activity'
                    },
                    blocks: blocks_modal_activity_1.blocksModalActivity(prefill),
                    submit: {
                        type: 'plain_text',
                        text: 'Save'
                    }
                }
            });
        }
        catch (err) {
            errors_1.slackErr(app, slackID, err);
        }
    });
    /**
     * Interactions that trigger the activity modal
     */
    // Slash command: /activity
    app.command('/activity', openDialog);
    // Global shortcut callback: add_activity
    app.shortcut('add_activity', openDialog);
    // Button from App Home
    app.action('btn_open_modal_activity', openDialog);
};
exports.modalActivity = modalActivity;
//# sourceMappingURL=modal-activity.js.map