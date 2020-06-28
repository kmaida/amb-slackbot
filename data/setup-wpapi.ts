import WPAPI from 'wpapi';
import { IWPActivity, IACFActivities } from '../types';
import axios from 'axios';
axios.defaults;

/*------------------
   WORDPRESS API
------------------*/

const _wpApiUrl = `${process.env.WP_URL}/index.php/wp-json`;
const _acfApiUrl = `${_wpApiUrl}/acf/v3`;

const wpApi = new WPAPI({
  endpoint: _wpApiUrl,
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

/**
 * Get Activities from ACF API (custom post type consisting of only ACF fields)
 * @returns {IACFActivities[]} array of activity objects from WP
 */
const wpGetActivities = async (): Promise<IACFActivities[]> => {
  try {
    const getActivities = await axios.get(`${_acfApiUrl}/activities`);
    const acfActivities: IACFActivities[] = getActivities.data;
    // console.log(acfActivities);
    return acfActivities;
  }
  catch (err) {
    console.error(err);
  }
};

/**
 * Add Activity from WordPress API
 * @param {IWPActivity} data activity data to add
 * @returns {Promise<IWPActivity>}
 */
const wpAddActivity = async (data: IWPActivity): Promise<IWPActivity> => {
  try {
    const addWpActivity = await wpApi.activities().create({
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
};

export { wpApi, wpApiSetup, wpGetActivities, wpAddActivity };
