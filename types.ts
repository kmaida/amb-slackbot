import mongoose from 'mongoose';

/*------------------
  TYPE INTERFACES
------------------*/

/**
 * @interface IObjectAny An object with any properties
 */
interface IObjectAny {
  [key: string]: any;
}

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
  activity_link: string;
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
 * @interface IAdminData Simple admin data object
 */
interface IAdminData {
  channel: string;
  admins: string[];
};
interface IAdminDocument extends IAdminData, mongoose.Document { }

/**
 * @interface IAppHomeData user's App Home data
 */
interface IAppHomeData {
  userID: string;
  viewID: string;
};
interface IAppHomeDocument extends IAppHomeData, mongoose.Document {}

/**
 * Exports
 */
export { IObjectAny, IActivity, IWPActivity, IACFActivity, IAdminData, IAdminDocument, IAppHomeData, IAppHomeDocument };
