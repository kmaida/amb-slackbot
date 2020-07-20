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
exports.dmConfirmSaveProfile = void 0;
const errors_1 = require("../../utils/errors");
const utils_profile_1 = require("./utils-profile");
/*------------------
DM CONFIRM SAVE PROFILE
------------------*/
const dmConfirmSaveProfile = (app, data) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = data.slack_id;
    const profileMsg = utils_profile_1.profileSlackMsg(data);
    try {
        const sendMsg = yield app.client.chat.postMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: userID,
            text: `:tada: Your profile has been saved successfully!\n${profileMsg}`,
            unfurl_links: false
        });
    }
    catch (err) {
        errors_1.slackErr(app, userID, err);
    }
});
exports.dmConfirmSaveProfile = dmConfirmSaveProfile;
//# sourceMappingURL=dm-confirm-save-profile.js.map