"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.scheduleATSyncs = exports.syncAT = void 0;
const cron = __importStar(require("cron"));
const update_view_home_1 = require("../app-home/update-view-home");
const errors_1 = require("./errors");
/*------------------
   SCHEDULED JOBS
------------------*/
/**
 * Sync all Airtable items
 * This should be used by admins when it's necessary to sync manual updates in AT
 * @param {IObjectAny} app Slack app
 * @param {string} userID (optional) user ID present if user is admin
 * @return {Promise<void>}
 */
const syncAT = (app, userID) => __awaiter(void 0, void 0, void 0, function* () {
    // @TODO: get all items that show up in home view
    // @TODO: e.g., activities, pending requests, swag requests, booking data, etc.
    try {
        // Update app home view for all users who have opened app home
        const updateHomes = update_view_home_1.updateAllHomes(app);
    }
    catch (err) {
        // If admin-initiated, send errors in DM
        if (userID) {
            errors_1.slackErr(app, userID, err);
        }
        else {
            errors_1.logErr(err);
        }
    }
    // If admin-initiated, confirm events synced with admin user in DM
    // if (userID) dmSyncEvents(app, userID, errSlack);
});
exports.syncAT = syncAT;
const scheduleATSyncs = (app) => {
    const job = new cron.CronJob({
        cronTime: '0 0 * * *',
        onTick: syncAT(app),
        timeZone: 'America/Detroit'
    });
    // Log next 3 scheduled dates
    console.log('JOBS: next 3 nightly event syncs scheduled for', job.nextDates(3).map(date => date.toString()));
    job.start();
};
exports.scheduleATSyncs = scheduleATSyncs;
//# sourceMappingURL=jobs.js.map