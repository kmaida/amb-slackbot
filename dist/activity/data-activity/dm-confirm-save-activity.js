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
exports.dmConfirmSaveActivity = void 0;
const errors_1 = require("../../utils/errors");
/*------------------
DM CONFIRM ACTIVITY SAVE
------------------*/
const dmConfirmSaveActivity = (app, atData) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = atData.slack_id;
    try {
        const sendMsg = yield app.client.chat.postMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: userID,
            text: `:tada: Your activity has been saved successfully. Thank you for your contribution!\n*Activity Type:* ${atData.type}\n*Title:* ${atData.title}\n*URL:* ${atData.url}\n*Date:* ${atData.date}\n*Topic:* ${atData.topic}\n*Reach:* ${atData.reach}`,
            unfurl_links: false
        });
    }
    catch (err) {
        errors_1.slackErr(app, userID, err);
    }
});
exports.dmConfirmSaveActivity = dmConfirmSaveActivity;
//# sourceMappingURL=dm-confirm-save-activity.js.map