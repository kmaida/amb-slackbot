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
exports.wpGetActivities = exports.wpApiSetup = void 0;
const wpapi_1 = __importDefault(require("wpapi"));
/*------------------
   WORDPRESS API
------------------*/
const _wp = new wpapi_1.default({
    endpoint: `${process.env.WPAPI_URL}/wp-json`,
    username: process.env.WP_USER,
    password: process.env.WP_PASSWORD
});
/**
 * WordPress API setup
 * Connect to wpapi
 */
const wpApiSetup = () => {
    const registerRoute = (slug) => {
        const namespace = 'wp/v2';
        const route = `/${slug}/(?P<id>)`;
        _wp.activities = _wp.registerRoute(namespace, route);
    };
    registerRoute('activities');
};
exports.wpApiSetup = wpApiSetup;
/**
 * Get Activities from WordPress API
 * @returns {IWPActivity[]} array of activity objects from WP
 */
const wpGetActivities = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getWpActivities = yield _wp.activities();
        const wpActivities = [];
        // Iterate over WP API results and create objects from ACF fields
        getWpActivities.forEach((activity) => {
            const acf = activity.ACF;
            const activityObj = {
                name: acf.activity_name,
                type: acf.activity_type,
                title: acf.activity_title,
                url: acf.activity_link,
                date: acf.activity_date,
                topic: acf.activity_topic
            };
            wpActivities.push(activityObj);
        });
        console.log(wpActivities);
        return wpActivities;
    }
    catch (err) {
        console.error(err);
    }
});
exports.wpGetActivities = wpGetActivities;
//# sourceMappingURL=setup-wpapi.js.map