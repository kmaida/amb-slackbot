/*------------------
ACTIVITY INTERFACES
------------------*/

/**
 * @interface IActivity Airtable activity data object
 */
interface IActivity {
  id?: string;
  name: string;
  email: string;
  type: string;
  date: string;
  title: string;
  url: string;
  topic: string;
  reach: number;
  quarter?: string;
  slackID: string;
  atLink?: string;
};

/**
 * @interface IWPActivity WordPress activity data object from ACF
 */
interface IWPActivity {
  activity_name: string;
  activity_type: string;
  activity_title: string;
  activity_date: string;
  activity_url: string;
  activity_topic: string;
  slack_id: string;
};

/**
 * @interface IACFActivity ACF array returned from ACF to REST API
 */
interface IACFActivity {
  id: number,
  acf: IWPActivity
};

/**
 * Exports
 */
export { IActivity, IWPActivity, IACFActivity };
