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
exports.wpApiSetup = exports.wpApiUrl = exports.wpApi = void 0;
const wpapi_1 = __importDefault(require("wpapi"));
/*------------------
   WORDPRESS API
------------------*/
const wpApiUrl = `${process.env.WP_URL}/index.php/wp-json`;
exports.wpApiUrl = wpApiUrl;
/**
 * WPAPI constructor with auth
 * @note auth: true doesn't work (no type)
 */
const wpApi = new wpapi_1.default({
    endpoint: wpApiUrl,
    username: process.env.WP_USER,
    password: process.env.WP_PASSWORD
});
exports.wpApi = wpApi;
/**
 * WordPress API setup
 * Connect to wpapi
 * Register activities route
 * Auto-discovery
 * @return {Promise<void>}
 */
const wpApiSetup = () => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * Register custom routes in REST API
     * @param {string} slug custom post type / desired endpoint in API
     */
    const registerRoute = (slug) => {
        const namespace = 'wp/v2';
        const route = `/${slug}/(?P<id>)`;
        wpApi[slug] = wpApi.registerRoute(namespace, route);
    };
    // Register custom post type "activities"
    registerRoute('activities');
    // Auto-discovery
    try {
        const discovery = yield wpapi_1.default.discover(process.env.WP_URL);
        // console.log('WP API DISCOVERY:', discovery);
    }
    catch (err) {
        console.error(err);
    }
});
exports.wpApiSetup = wpApiSetup;
//# sourceMappingURL=setup-wpapi.js.map