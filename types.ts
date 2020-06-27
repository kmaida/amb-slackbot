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
  name: string;
  type: string;
  date: string;
  url: string;
  topic: string;
}

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
export { IObjectAny, IActivity, IWPActivity, IAdminData, IAdminDocument, IAppHomeData, IAppHomeDocument };
