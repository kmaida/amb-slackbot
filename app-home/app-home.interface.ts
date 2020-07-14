import mongoose from 'mongoose';

/*------------------
  TYPE INTERFACES
------------------*/

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
interface IAppHomeDocument extends IAppHomeData, mongoose.Document { }

/**
 * Exports
 */
export { IAdminData, IAdminDocument, IAppHomeData, IAppHomeDocument };
