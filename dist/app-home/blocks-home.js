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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const btn_open_modal_activity_1 = __importDefault(require("../activity/btn-open-modal-activity"));
const blocks_home_admin_1 = __importDefault(require("./admin/blocks-home-admin"));
const api_admin_1 = require("./admin/api-admin");
/*------------------
 BLOCKS: HOME VIEW
------------------*/
/**
 * Get composed blocks for user App Home view
 * @param {string} userID ID of user who opened home
 * @param {any} metadata any data from home view that should be propagated
 * @returns {Promise<IObjectAny[]>} promise of array of block kit objects
 */
const blocksHome = (userID, metadata) => __awaiter(void 0, void 0, void 0, function* () {
    const adminSettings = yield api_admin_1.getAdminSettings();
    const reportingChannel = adminSettings.channel;
    const admins = adminSettings.admins;
    const allUserBlocks = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `:wave: *Hello, <@${userID}>!* I'm <@${process.env.SLACK_BOT_ID}>.`
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `:mega: Check out what your teammates are reporting in <#${reportingChannel}>.`
            }
        },
        {
            "type": "actions",
            "elements": [
                btn_open_modal_activity_1.default(metadata)
            ]
        }
    ];
    /**
     * Determine if user is admin
     * If admin, add admin blocks to view
     * @returns {IObjectAny[]} array of home block objects
     */
    const composeHomeBlocks = () => {
        if (admins.indexOf(userID) > -1) {
            const admin = blocks_home_admin_1.default(reportingChannel, admins);
            return [...allUserBlocks, ...admin];
        }
        else {
            return allUserBlocks;
        }
    };
    /**
     * @returns composed blocks for appropriate home view for this user (admin or non-admin)
     */
    return composeHomeBlocks();
});
exports.default = blocksHome;
//# sourceMappingURL=blocks-home.js.map