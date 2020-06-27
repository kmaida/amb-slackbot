import WPAPI from 'wpapi';
import { IObjectAny, IWPActivity } from '../types';

/*------------------
   WORDPRESS API
------------------*/

const _wp = new WPAPI({
  endpoint: `${process.env.WPAPI_URL}/wp-json`,
  username: process.env.WP_USER,
  password: process.env.WP_PASSWORD
});

/**
 * WordPress API setup
 * Connect to wpapi
 */
const wpApiSetup = (): void => {
  const registerRoute = (slug: string) => {
    const namespace = 'wp/v2';
    const route = `/${slug}/(?P<id>)`;
    _wp.activities = _wp.registerRoute(namespace, route);
  }
  registerRoute('activities');
};

/**
 * Get Activities from WordPress API
 * @returns {IWPActivity[]} array of activity objects from WP
 */
const wpGetActivities = async (): Promise<IWPActivity[]> => {
  try {
    const getWpActivities = await _wp.activities();
    const wpActivities: IWPActivity[] = [];
    // Iterate over WP API results and create objects from ACF fields
    getWpActivities.forEach((activity: IObjectAny) => {
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
};

export { wpApiSetup, wpGetActivities };
