/*------------------
PROFILE TYPE INTERFACES
------------------*/

/**
 * @interface IProfile accumulated profile data from all data sources
 */
interface IProfile {
  id?: string;
  wpid?: number;
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
  slackID?: string;
  atLink?: string;
};

/**
 * @interface IProfilePrefill Profile data object prefilled values
 */
interface IProfilePrefill {
  name?: string;
  email?: string;
  image?: string;
  bio?: string;
  website?: string;
  twitter?: string;
  github?: string;
  location?: string;
  airport?: string;
  airline?: string;
  ff?: string;
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
  slackID: string;
  atLink?: string;
}

/**
 * @interface IProfileMeta metadata for profile view submission
 */
interface IProfileMeta {
  image: string;
  id?: string;
  wpid?: number;
}

export { IProfile, IProfilePrefill, IWPProfile, IATProfile, IACFProfile, IProfileMeta };