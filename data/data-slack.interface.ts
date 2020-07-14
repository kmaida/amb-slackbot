/*------------------
SLACK TYPE INTERFACES
------------------*/

/**
 * @interface ISlackUserInfo Slack user info
 * Name
 * Email
 * Image
 */
interface ISlackUserInfo {
  name: string;
  email: string;
  image: string;
};

export { ISlackUserInfo };