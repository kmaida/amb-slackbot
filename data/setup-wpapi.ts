import WPAPI from 'wpapi';
import { IObjectAny, IWPActivity, IACFActivities } from '../types';
import axios from 'axios';
axios.defaults;

/*------------------
   WORDPRESS API
------------------*/

const _wpApiUrl = `${process.env.WP_URL}/index.php/wp-json`;
const _acfApiUrl = `${_wpApiUrl}//acf/v3`;

const _wp = new WPAPI({
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
const wpApiSetup = async (): Promise<void> => {
  const registerRoute = (slug: string) => {
    const namespace = 'wp/v2';
    const route = `/${slug}/(?P<id>)`;
    _wp[slug] = _wp.registerRoute(namespace, route);
  }
  registerRoute('activities');
  const discovery = await WPAPI.discover(process.env.WP_URL);
  // console.log(discovery);
};

/**
 * Get Activities from REST API (ACF API)
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
    const addWpActivity = await _wp.activities().create({
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

export { wpApiSetup, wpGetActivities, wpAddActivity };
