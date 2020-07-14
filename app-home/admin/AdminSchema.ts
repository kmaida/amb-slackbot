import mongoose from 'mongoose';
import { IAdminDocument, IAppHomeDocument } from '../app-home.interface';
const Schema = mongoose.Schema;

/*------------------
   ADMIN SCHEMAS
------------------*/

/**
 * Admin settings object
 */
const adminSchema = new Schema({
  channel: { type: String, required: true },
  admins: [String]
});
const AdminSettingsModel = mongoose.model<IAdminDocument>('Admin', adminSchema);

/**
 * User's app home view
 */
const appHomeSchema = new Schema({
  userID: { type: String, required: true },
  viewID: { type: String, required: true }
});
const AppHomeModel = mongoose.model<IAppHomeDocument>('AppHome', appHomeSchema);

export { AdminSettingsModel, AppHomeModel };
