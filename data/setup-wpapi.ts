import WPAPI from 'wpapi';
import { IWPActivity, IACFActivities } from '../types';
import axios from 'axios';
axios.defaults;

/*------------------
   WORDPRESS API
------------------*/

const wpApiUrl = `${process.env.WP_URL}/index.php/wp-json`;
const acfApiUrl = `${wpApiUrl}/acf/v3`;

const wpApi = new WPAPI({
  endpoint: wpApiUrl,
  username: process.env.WP_USER,
  password: process.env.WP_PASSWORD
});

/**
 * WordPress API setup
 * Connect to wpapi
 * Register activities route
 * Auto-discovery
 * @returns {Promise<void>}
 */
const wpApiSetup = async (): Promise<void> => {
  /**
   * Register custom routes in REST API
   * @param {string} slug custom post type / desired endpoint in API
   */
  const registerRoute = (slug: string) => {
    const namespace = 'wp/v2';
    const route = `/${slug}/(?P<id>)`;
    wpApi[slug] = wpApi.registerRoute(namespace, route);
  }
  // Register custom post type "activities"
  registerRoute('activities');
  // Auto-discovery
  try {
    const discovery = await WPAPI.discover(process.env.WP_URL);
  // console.log('WP API DISCOVERY:', discovery);
  }
  catch (err) {
    console.error(err);
  }
};

export { wpApi, wpApiUrl, acfApiUrl, wpApiSetup };
