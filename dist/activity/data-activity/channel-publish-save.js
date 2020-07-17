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
exports.channelPublishSave = void 0;
const errors_1 = require("../../utils/errors");
const api_admin_1 = require("../../app-home/admin/api-admin");
/*------------------
PUBLIC CHANNEL PUBLISH SAVE
------------------*/
const channelPublishSave = (app, wpData) => __awaiter(void 0, void 0, void 0, function* () {
    const settings = yield api_admin_1.getAdminSettings();
    const channel = settings.channel;
    try {
        const sendMsg = yield app.client.chat.postMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: channel,
            text: `:new: *New Activity* submitted by \`<@${wpData.slack_id}>\`:\n*Name:* ${wpData.activity_name}\n*Activity Type:* ${wpData.activity_type}\n*Title:* ${wpData.activity_title}\n*URL:* ${wpData.activity_url}\n*Date:* ${wpData.activity_date}\n*Topic:* ${wpData.activity_topic}`,
            unfurl_links: false
        });
    }
    catch (err) {
        errors_1.slackErr(app, channel, err);
    }
});
exports.channelPublishSave = channelPublishSave;
//# sourceMappingURL=channel-publish-save.js.map