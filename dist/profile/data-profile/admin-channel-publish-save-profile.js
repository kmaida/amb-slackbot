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
exports.adminChannelProfileSave = void 0;
const errors_1 = require("../../utils/errors");
const utils_profile_1 = require("./utils-profile");
/*------------------
ADMIN CHANNEL PROFILE SAVE
------------------*/
const adminChannelProfileSave = (app, data) => __awaiter(void 0, void 0, void 0, function* () {
    const channel = process.env.SLACK_ADMIN_CHANNEL_ID;
    const profileMsg = utils_profile_1.profileSlackMsg(data);
    try {
        const sendMsg = yield app.client.chat.postMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: channel,
            text: `:card_index: *Profile* added or updated by \`<@${data.slack_id}>\`:\n${profileMsg}\n:link: <${data.at_link}|View in Airtable>`,
            unfurl_links: false
        });
    }
    catch (err) {
        errors_1.slackErr(app, channel, err);
    }
});
exports.adminChannelProfileSave = adminChannelProfileSave;
//# sourceMappingURL=admin-channel-publish-save-profile.js.map