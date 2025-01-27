/*------------------
ACTIVITY INTERFACES
------------------*/

/**
 * @interface IActivity Activity data object
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
  slack_id: string;
  at_link?: string;
};

/**
 * @interface ISelectOption
 */
interface ISelectOption {
  text: {
    type: string;
    text: string;
  },
  value: string;
};

/**
 * @interface IActivityPrefill Activity data object prefilled values
 */
interface IActivityPrefill {
  name?: string;
  email?: string;
  type?: string;
  date?: string;
  title?: string;
  url?: string;
  topic?: string;
  reach?: number;
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
export { IActivity, ISelectOption, IActivityPrefill, IWPActivity, IACFActivity };
