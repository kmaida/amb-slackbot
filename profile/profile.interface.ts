/*------------------
PROFILE TYPE INTERFACES
------------------*/

/**
 * @interface IProfile accumulated profile data from all data sources
 */
interface IProfile {
  id?: string;
  name: string;
  email: string;
  image?: string;
  bio: string;
  website?: string;
  twitter?: string;
  github?: string;
  location: string;
  airport?: string;
  airline?: string;
  ff?: string;
  passID?: string;
  slackID?: string;
};

/**
 * @interface IWPProfile ACF profile data for WordPress
 */
interface IWPProfile {
  profile_name: string;
  profile_bio: string;
  profile_location: string;
  profile_website: string;
  profile_twitter: string;
  profile_github: string;
  profile_image: string;
  slack_id: string;
};

/**
 * @interface IACFProfile ACF array returned from ACF to REST API
 */
interface IACFProfile {
  id: number,
  acf: IWPProfile
};

/**
 * @interface IATProfile Airtable profile data
 */
interface IATProfile {
  id?: string;
  name: string;
  email: string;
  bio: string;
  location: string;
  airport?: string;
  airline?: string;
  ff?: string;
  passID?: string;
  slackID: string;
  atLink?: string;
}

export { IProfile, IWPProfile, IATProfile, IACFProfile };