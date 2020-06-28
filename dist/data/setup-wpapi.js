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
exports.wpAddActivity = exports.wpGetActivities = exports.wpApiSetup = void 0;
const wpapi_1 = __importDefault(require("wpapi"));
const axios_1 = __importDefault(require("axios"));
axios_1.default.defaults;
/*------------------
   WORDPRESS API
------------------*/
const _wpApiUrl = `${process.env.WP_URL}/index.php/wp-json`;
const _acfApiUrl = `${_wpApiUrl}//acf/v3`;
const _wp = new wpapi_1.default({
    endpoint: _wpApiUrl,
    username: process.env.WP_USER,
    password: process.env.WP_PASSWORD
});
/**
 * WordPress API setup
 * Connect to wpapi
 * Register activities route
 * Auto-discovery
 */
const wpApiSetup = () => __awaiter(void 0, void 0, void 0, function* () {
    const registerRoute = (slug) => {
        const namespace = 'wp/v2';
        const route = `/${slug}/(?P<id>)`;
        _wp[slug] = _wp.registerRoute(namespace, route);
    };
    registerRoute('activities');
    const discovery = yield wpapi_1.default.discover(process.env.WP_URL);
    // console.log(discovery);
});
exports.wpApiSetup = wpApiSetup;
/**
 * Get Activities from REST API (ACF API)
 * @returns {IACFActivities[]} array of activity objects from WP
 */
const wpGetActivities = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getActivities = yield axios_1.default.get(`${_acfApiUrl}/activities`);
        const acfActivities = getActivities.data;
        // console.log(acfActivities);
        return acfActivities;
    }
    catch (err) {
        console.error(err);
    }
});
exports.wpGetActivities = wpGetActivities;
/**
 * Add Activity from WordPress API
 * @param {IWPActivity} data activity data to add
 * @returns {Promise<IWPActivity>}
 */
const wpAddActivity = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addWpActivity = yield _wp.activities().create({
            title: data.activity_title,
            content: '',
            fields: data,
            status: 'publish'
        });
        const acfActivity = addWpActivity.acf;
        // console.log(acfActivity);
        return acfActivity;
    }
    catch (err) {
        console.error(err);
    }
});
exports.wpAddActivity = wpAddActivity;
//# sourceMappingURL=setup-wpapi.js.map